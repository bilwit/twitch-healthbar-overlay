import { PrismaClient } from "@prisma/client";
import consoleLogStyling from "../utils/consoleLogStyling";

interface Monster {
  id: number,
  hp_multiplier: number,
  trigger_words: string,
}

export interface Monster_CB {
  id: number,
  trigger_words: string,
  update: (amount: number, updatedMaxHealth: number) => void,
}

const prisma = new PrismaClient();

export default async function getMonsters(maxHealthInit: number): Promise<Monster_CB[]> {
  try {
    const monsters = await prisma.monster.findMany({
      select: {
        id: true,
        hp_multiplier: true,
        trigger_words: true,
      },
      where: {
        published: true,
      }
    })
  
    if (monsters && Array.isArray(monsters) && monsters.length > 0) {
      return monsters.map((monster) => {
        return Monster(monster, maxHealthInit);
      });
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
    return [];
  }
}

function Monster(monster: Monster, maxHealth: number): any {
  try {
    // initialize health
    let MaxHealth = maxHealth * monster.hp_multiplier;
    let CurrentHealth = {
      maxHealth: MaxHealth,
      value: MaxHealth,
    };

    console.log(consoleLogStyling('health', '(' + monster.id + ') Initial Health: ' + MaxHealth));

    return {
      id: monster.id,
      trigger_words: monster.trigger_words,
      update: function(amount: number, updatedChatterAmount: number) {
        const updatedMaxHealth = updatedChatterAmount * monster.hp_multiplier;
        if (CurrentHealth.maxHealth !== updatedMaxHealth) {
          CurrentHealth.value = (CurrentHealth.value / CurrentHealth.maxHealth) * updatedMaxHealth + amount;
          CurrentHealth.maxHealth = updatedMaxHealth;
        } else {
          CurrentHealth.value += amount;
        }
        console.log(consoleLogStyling('health', '(' + monster.id + ') Current Health: ' + CurrentHealth.value));
      }
    }

  } catch (e) {
    console.log(e);
  }
}

prisma.$disconnect();
