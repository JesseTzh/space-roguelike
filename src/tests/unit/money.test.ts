import { calculateKillMoney, calculateStageReward, spendMoney } from '../../systems/MoneySystem'

describe('MoneySystem', () => {
  it('applies money bonus to kill money', () => {
    expect(calculateKillMoney({ money: 10 }, { moneyBonus: 0.5 })).toBe(15)
  })

  it('applies hp bonus and money bonus to stage reward', () => {
    expect(calculateStageReward({ baseReward: 100 }, { hp: 50, maxHp: 100, moneyBonus: 0.2 })).toBe(150)
  })

  it('spends only when money is enough', () => {
    expect(spendMoney(100, 80)).toBe(20)
    expect(spendMoney(40, 80)).toBe(40)
  })
})
