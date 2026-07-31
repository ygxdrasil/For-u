/**
 * The market universe.
 *
 * The crypto sweep's biggest statistical flaw was treating 18 BTC-correlated
 * pairs as 18 independent bets. Commodities, FX, bonds and equities are driven
 * by genuinely different forces, so an edge that holds ACROSS asset classes is
 * evidence in a way that 18 alts never were.
 */

export type AssetClass = 'crypto' | 'equity-index' | 'fx' | 'commodity' | 'bond' | 'sector' | 'stock';

export interface Market {
  symbol: string;
  name: string;
  cls: AssetClass;
  /** 'coinbase' uses the crypto fetcher; 'yahoo' uses the index fetcher. */
  source: 'coinbase' | 'yahoo';
}

export const CRYPTO: Market[] = [
  'BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD', 'AVAX-USD',
  'LINK-USD', 'DOT-USD', 'LTC-USD', 'BCH-USD', 'DOGE-USD', 'ATOM-USD',
  'UNI-USD', 'AAVE-USD', 'ETC-USD', 'FIL-USD', 'ALGO-USD', 'XLM-USD',
].map((s) => ({ symbol: s, name: s.replace('-USD', ''), cls: 'crypto' as const, source: 'coinbase' as const }));

const y = (symbol: string, name: string, cls: AssetClass): Market => ({ symbol, name, cls, source: 'yahoo' });

export const EQUITY_INDICES: Market[] = [
  y('^GSPC', 'S&P 500', 'equity-index'), y('^DJI', 'Dow Jones', 'equity-index'),
  y('^IXIC', 'Nasdaq Comp', 'equity-index'), y('^NDX', 'Nasdaq 100', 'equity-index'),
  y('^RUT', 'Russell 2000', 'equity-index'), y('^FTSE', 'FTSE 100', 'equity-index'),
  y('^GDAXI', 'DAX', 'equity-index'), y('^FCHI', 'CAC 40', 'equity-index'),
  y('^STOXX50E', 'Euro Stoxx 50', 'equity-index'), y('^OMX', 'OMX Sthlm 30', 'equity-index'),
  y('^N225', 'Nikkei 225', 'equity-index'), y('^HSI', 'Hang Seng', 'equity-index'),
  y('^AXJO', 'ASX 200', 'equity-index'), y('^BSESN', 'BSE Sensex', 'equity-index'),
  y('^KS11', 'KOSPI', 'equity-index'), y('^GSPTSE', 'TSX Comp', 'equity-index'),
];

export const FX: Market[] = [
  y('EURUSD=X', 'EUR/USD', 'fx'), y('GBPUSD=X', 'GBP/USD', 'fx'),
  y('USDJPY=X', 'USD/JPY', 'fx'), y('AUDUSD=X', 'AUD/USD', 'fx'),
  y('USDCAD=X', 'USD/CAD', 'fx'), y('USDCHF=X', 'USD/CHF', 'fx'),
  y('NZDUSD=X', 'NZD/USD', 'fx'), y('EURSEK=X', 'EUR/SEK', 'fx'),
];

export const COMMODITIES: Market[] = [
  y('GC=F', 'Gold', 'commodity'), y('SI=F', 'Silver', 'commodity'),
  y('CL=F', 'Crude Oil', 'commodity'), y('NG=F', 'Nat Gas', 'commodity'),
  y('HG=F', 'Copper', 'commodity'), y('ZC=F', 'Corn', 'commodity'),
  y('ZW=F', 'Wheat', 'commodity'), y('ZS=F', 'Soybeans', 'commodity'),
  y('KC=F', 'Coffee', 'commodity'), y('PL=F', 'Platinum', 'commodity'),
];

export const BONDS: Market[] = [
  y('TLT', 'US 20y Treas', 'bond'), y('IEF', 'US 7-10y Treas', 'bond'),
  y('SHY', 'US 1-3y Treas', 'bond'), y('HYG', 'High Yield', 'bond'),
  y('LQD', 'IG Corporate', 'bond'),
];

export const SECTORS: Market[] = [
  y('XLE', 'Energy', 'sector'), y('XLF', 'Financials', 'sector'),
  y('XLK', 'Technology', 'sector'), y('XLV', 'Healthcare', 'sector'),
  y('XLU', 'Utilities', 'sector'), y('XLI', 'Industrials', 'sector'),
  y('XLP', 'Staples', 'sector'), y('XLY', 'Discretionary', 'sector'),
];

export const STOCKS: Market[] = [
  y('AAPL', 'Apple', 'stock'), y('MSFT', 'Microsoft', 'stock'),
  y('AMZN', 'Amazon', 'stock'), y('GOOGL', 'Alphabet', 'stock'),
  y('JPM', 'JPMorgan', 'stock'), y('XOM', 'Exxon', 'stock'),
  y('KO', 'Coca-Cola', 'stock'), y('JNJ', 'J&J', 'stock'),
  y('WMT', 'Walmart', 'stock'), y('PG', 'P&G', 'stock'),
  y('NVDA', 'Nvidia', 'stock'), y('TSLA', 'Tesla', 'stock'),
];

export const ALL_MARKETS: Market[] = [
  ...CRYPTO, ...EQUITY_INDICES, ...FX, ...COMMODITIES, ...BONDS, ...SECTORS, ...STOCKS,
];
