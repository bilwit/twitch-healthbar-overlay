import { PrismaClient } from "@prisma/client";
import consoleLogStyling from "../utils/consoleLogStyling";
import { EventEmitter } from "stream";

interface Monster {
  id: number,
  hp_multiplier: number,
  trigger_words: string,
  relations_id?: number | null,
}

export interface Monster_CB {
  id: number,
  trigger_words: string,
  update: (amount: number, updatedMaxHealth: number) => void,
}

const prisma = new PrismaClient();

export default async function getMonsters(maxHealthInit: number, TwitchEmitter: EventEmitter): Promise<Map<number, Monster_CB>
> {
  try {
    const monsters = await prisma.monster.findMany({
      select: {
        id: true,
        hp_multiplier: true,
        trigger_words: true,
        relations_id: true,
      },
      where: {
        published: true,
      }
    });
  
    if (monsters && Array.isArray(monsters) && monsters.length > 0) {
      const monsterDict = new Map<number, Monster_CB>();

      for (const monster of monsters) {
        monsterDict.set(monster.id, Monster(monster, maxHealthInit, TwitchEmitter));
      }

      return monsterDict;
    } else {
      return new Map<number, Monster_CB>();
    }
  } catch (e) {
    console.error(e);
    return new Map<number, Monster_CB>();
  }
}

export async function getMonster(id: number, maxHealthInit: number, TwitchEmitter: EventEmitter): Promise<Monster_CB | null> {
  try {
    const monster = await prisma.monster.findFirst({
      select: {
        id: true,
        hp_multiplier: true,
        trigger_words: true,
        relations_id: true,
      },
      where: {
        id: id,
      }
    });

    if (monster) {
      return Monster(monster, maxHealthInit, TwitchEmitter);
    } else {
      throw 'Monster ID not found';
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function Monster(monster: Monster, maxHealth: number, TwitchEmitter: EventEmitter): any {
  try {
    // initialize health
    let MaxHealth = maxHealth * monster.hp_multiplier;
    let CurrentHealth = {
      maxHealth: MaxHealth,
      value: MaxHealth,
    };

    let isPaused = false;

    const updateHealth = () => {
      if (!isPaused) {
        TwitchEmitter.emit('update', {
          id: monster.id,
          value: CurrentHealth,
        });
      }
    }

    TwitchEmitter.on('pause', (data) => {
      if (monster.relations_id && data?.relations_id === monster.relations_id) {
        isPaused = true;
        console.log(consoleLogStyling('health', '(' + monster.id + ') Paused'));
      }
    });

    TwitchEmitter.on('unpause', (data) => {
      if (monster.relations_id && data?.relations_id === monster.relations_id) {
        isPaused = false;
        console.log(consoleLogStyling('health', '(' + monster.id + ') Unpaused'));
      }
    });

    TwitchEmitter.on('reset', (data) => {
      if (data.id === monster.id) {
        CurrentHealth.value = CurrentHealth.maxHealth;
        updateHealth();
        console.log(consoleLogStyling('health', '(' + monster.id + ') Health Reset: ' + MaxHealth));
      }
    });

    // send initial health data
    updateHealth();
    console.log(consoleLogStyling('health', '(' + monster.id + ') Initial Health: ' + MaxHealth));

    return {
      id: monster.id,
      trigger_words: monster.trigger_words,
      update: function(amount: number, updatedChatterAmount: number) {
        const updatedMaxHealth = updatedChatterAmount * monster.hp_multiplier;
        if (CurrentHealth.value >= 0) {
          if (CurrentHealth.maxHealth !== updatedMaxHealth) {
            CurrentHealth.value = (CurrentHealth.value / CurrentHealth.maxHealth) * updatedMaxHealth + amount;
            CurrentHealth.maxHealth = updatedMaxHealth;
          } else {
            CurrentHealth.value += amount;
          }

          updateHealth();
          console.log(consoleLogStyling('health', '(' + monster.id + ') Current Health: ' + CurrentHealth.value));
        } else {
          if (monster.relations_id) {
            TwitchEmitter.emit('pause', {
              relations_id: monster.relations_id,
            });
          }
        }
      }
    }

  } catch (e) {
    console.log(e);
  }
}

prisma.$disconnect();
