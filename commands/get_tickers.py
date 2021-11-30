from pykrx import stock
import pandas as pd

all_tickers = stock.get_market_ticker_list(market="ALL")
etf_tickers = stock.get_etf_ticker_list()
df_all = pd.DataFrame([[ticker,stock.get_market_ticker_name(ticker)] for ticker in all_tickers], columns = ["ticker", "name"])
df_etf = pd.DataFrame([[ticker,stock.get_etf_ticker_name(ticker)] for ticker in etf_tickers], columns = ["ticker", "name"])

df_all = df_all.append(df_etf)
df_all.to_csv('tickers.csv')