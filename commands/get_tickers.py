from pykrx import stock
import pandas as pd

tickers = stock.get_market_ticker_list(market="ALL")
df = pd.DataFrame([[ticker,stock.get_market_ticker_name(ticker)] for ticker in tickers], columns = ["ticker", "name"])
df.to_csv('tickers.csv')
