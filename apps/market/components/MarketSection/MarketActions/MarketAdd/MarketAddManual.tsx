import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Checker, Web3Input } from '@zenlink-interface/compat'
import { Amount, type Token, tryParseAmount } from '@zenlink-interface/currency'
import { type Market, assetToSy } from '@zenlink-interface/market'
import { ZERO } from '@zenlink-interface/math'
import { Button, Currency, Dots, Typography } from '@zenlink-interface/ui'
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import { Trans } from '@lingui/macro'
import { MarketAddManualReviewModal } from './MarketAddManualReviewModal'

interface MarketAddManualProps {
  market: Market
}

export const MarketAddManual: FC<MarketAddManualProps> = ({ market }) => {
  const [{ tokenInput, ptInput }, setTypedAmounts] = useState<{ tokenInput: string, ptInput: string }>(
    { tokenInput: '', ptInput: '' },
  )

  const [parsedTokenInput, parsedPtInput] = useMemo(() => {
    return [tryParseAmount(tokenInput, market.SY.yieldToken), tryParseAmount(ptInput, market.PT)]
  }, [market.PT, market.SY.yieldToken, ptInput, tokenInput])

  const onChangeTokenTypedAmount = useCallback((value: string) => {
    if (market.marketState.totalLp.equalTo(ZERO)) {
      setTypedAmounts(prev => ({
        ...prev,
        tokenInput: value,
      }))
    }
    else {
      const parsedAmount = tryParseAmount(value, market.SY.yieldToken)

      setTypedAmounts({
        tokenInput: value,
        ptInput: parsedAmount
          ? market
            .priceOf(market.SY)
            .quote(market.SY.previewDeposit(market.SY.yieldToken, parsedAmount))
            .toExact()
          : '',
      })
    }
  }, [market])

  const onChangePtTypedAmount = useCallback((value: string) => {
    if (market.marketState.totalLp.equalTo(ZERO)) {
      setTypedAmounts(prev => ({
        ...prev,
        ptInput: value,
      }))
    }
    else {
      const parsedAmount = tryParseAmount(value, market.PT)
      setTypedAmounts({
        ptInput: value,
        tokenInput: parsedAmount
          ? market.SY.previewRedeem(
            market.SY.yieldToken,
            Amount.fromRawAmount(market.SY, market.priceOf(market.PT).quote(parsedAmount).quotient),
          ).toExact()
          : '',
      })
    }
  }, [market])

  const lpMinted = useMemo(() => {
    if (!parsedTokenInput || !parsedPtInput)
      return Amount.fromRawAmount(market, ZERO)

    return market.getLiquidityMinted(
      Amount.fromRawAmount(
        market.SY,
        assetToSy(market.YT.pyIndexCurrent, parsedTokenInput.quotient),
      ),
      parsedPtInput,
    )
  }, [market, parsedPtInput, parsedTokenInput])

  return (
    <MarketAddManualReviewModal
      lpMinted={lpMinted}
      market={market}
      parsedPtInput={parsedPtInput}
      parsedTokenInput={parsedTokenInput}
      ptInputValue={ptInput}
      tokenInputValue={tokenInput}
    >
      {({ isWritePending, setOpen }) => (
        <MarketAddManualWidget
          lpMinted={lpMinted}
          market={market}
          ptInput={ptInput}
          setPtInput={onChangePtTypedAmount}
          setTokenInput={onChangeTokenTypedAmount}
          tokenInput={tokenInput}
        >
          <Checker.Connected chainId={market.chainId} fullWidth size="md">
            <Checker.Network chainId={market.chainId} fullWidth size="md">
              <Checker.Amounts
                amounts={[parsedTokenInput, parsedPtInput]}
                chainId={market.chainId}
                fullWidth
                size="md"
              >
                <Button disabled={isWritePending} fullWidth onClick={() => setOpen(true)} size="md">
                  {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Add</Trans>}
                </Button>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connected>
        </MarketAddManualWidget>
      )}
    </MarketAddManualReviewModal>
  )
}

interface MarketAddManualWidgetProps {
  market: Market
  tokenInputValue?: string
  tokenInput?: string
  setTokenInput?: (input: string) => void
  ptInputValue?: string
  ptInput?: string
  setPtInput?: (input: string) => void
  lpMinted: Amount<Token>
  children?: ReactNode
}

export const MarketAddManualWidget: FC<MarketAddManualWidgetProps> = ({
  market,
  tokenInput,
  tokenInputValue,
  setTokenInput,
  ptInput,
  ptInputValue,
  setPtInput,
  lpMinted,
  children,
}) => {
  return (
    <div className="my-2">
      <Web3Input.Currency
        chainId={market.chainId}
        className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-2xl"
        currency={market.SY.yieldToken}
        disableMaxButton={!!tokenInputValue}
        disabled={!!tokenInputValue}
        loading={false}
        onChange={(input: string) => { setTokenInput?.(input) }}
        tokenMap={{}}
        value={tokenInputValue || tokenInput || ''}
      />
      <div className="flex items-center justify-center -mt-[10px] -mb-[10px] z-10">
        <div className="group bg-white dark:bg-slate-700 p-0.5 border-4 border-gray-200 dark:border-slate-800 rounded-full">
          <PlusIcon height={16} width={16} />
        </div>
      </div>
      <Web3Input.Currency
        chainId={market.chainId}
        className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-2xl"
        currency={market.PT}
        disableMaxButton={!!ptInputValue}
        disabled={!!ptInputValue}
        loading={false}
        onChange={(input: string) => { setPtInput?.(input) }}
        tokenMap={{}}
        value={ptInputValue || ptInput || ''}
      />
      <div className="flex items-center justify-center -mt-[10px] -mb-[10px] z-10">
        <div className="group bg-white dark:bg-slate-700 p-0.5 border-4 border-gray-200 dark:border-slate-800 rounded-full">
          <ChevronDownIcon height={16} width={16} />
        </div>
      </div>
      <div className="flex flex-col bg-white/50 dark:bg-slate-700/50 rounded-2xl p-4 gap-1">
        <div className="flex items-center justify-between border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2">
          <Typography variant="lg" weight={500}>{lpMinted.toSignificant(6)}</Typography>
          <div className="flex items-center text-sm gap-2">
            <Currency.Icon
              currency={lpMinted.currency}
              disableLink
              height={24}
              width={24}
            />
            <Typography variant="base" weight={600}>{lpMinted.currency.symbol}</Typography>
          </div>
        </div>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  )
}
