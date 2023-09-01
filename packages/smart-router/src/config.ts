import { ParachainId } from '@zenlink-interface/chain'

export const ENABLED_AGGREGATION_ROUTER_CHAINS = [
  ParachainId.MOONBEAM,
  ParachainId.SCROLL_ALPHA,
  ParachainId.BASE,
  ParachainId.ASTAR,
]

export function isAggregationRouter(chainId?: number) {
  return Boolean(chainId && ENABLED_AGGREGATION_ROUTER_CHAINS.includes(chainId))
}

export function getAggregationExecutorAddressForChainId(chainId: ParachainId) {
  switch (chainId) {
    case ParachainId.MOONBEAM:
      return '0x832B21FA3AA074Ee5328f653D9DB147Bcb155C7a'
    case ParachainId.SCROLL_ALPHA:
      return '0xf6EA707CBf38f2Acf3bf029429B55192c61c67ad'
    case ParachainId.BASE:
      return '0x4e231728d42565830157FFFaBBB9c78aD5152E94'
    case ParachainId.ASTAR:
      return '0xB2cd90D03Db75053b9ab855fBD7e5339d0e01d54'
    default:
      throw new Error(`Unsupported route processor network for ${chainId}`)
  }
}

export function getAggregationRouterAddressForChainId(chainId: ParachainId) {
  switch (chainId) {
    case ParachainId.MOONBEAM:
      return '0x603eF396029b5e89f9420b4192814aEC0664ADAb'
    case ParachainId.SCROLL_ALPHA:
      return '0xAd4f1E1Ba6bD15ab06E9eA4Dd0583b4693b669B1'
    case ParachainId.BASE:
      return '0x7BAe21fB8408D534aDfeFcB46371c3576a1D5717'
    case ParachainId.ASTAR:
      return '0x8f68eAA5DD8c43fdb9A236ed9C76DD6182D3060D'
    default:
      throw new Error(`Unsupported route processor network for ${chainId}`)
  }
}
