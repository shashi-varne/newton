import { getConfig } from 'utils/functions';

const { productName } = getConfig();

export const riskProfileMap = {
  1: {
    title: 'Conservative Investor',
    contennt: 'Investor like you are comfortable in accepting lower returns for a higher degree of liquidity or stability. Typically, a Conservative investor primarly seeks to minimize risk and loss of money.',
    img: require(`assets/${productName}/meter-conservative.svg`)
  },
  2: {
    title: 'Moderately Conservative Investor',
    contennt: 'You have a low risk appetite. Consistent and sustainable returns are what you as an investor need.',
    img: require(`assets/${productName}/meter-moderately-conservative.svg`)
  },
  3: {
    title: 'Moderate Investor',
    contennt: 'You have a moderate tolerance for risk, investors like you values reducing risks and enhancing returns equally. Also, moderate investors are willing to accept modest risks to seek higher long-term returns.',
    img: require(`assets/${productName}/meter-moderate.svg`)
  },
  4: {
    title: 'Moderately Aggresive Investor',
    contennt: 'You are ready to take high risk by investing in risky bets. You seem to be okay with risks as long as the reward compensates well.',
    img: require(`assets/${productName}/meter-moderately-aggressive.svg`)
  },
  5: {
    title: 'Aggressive Investor',
    contennt: 'You have a very high tolerance for risk, investors like you prefer to stay in the market in times of extreme volatility in exchange for the possibility of receiving high relative returns over the time to outpace inflation.',
    img: require(`assets/${productName}/meter-aggressive.svg`)
  }
}