
import { TickerTape } from "react-ts-tradingview-widgets";
import { MarketData } from "react-ts-tradingview-widgets";
import { Timeline } from "react-ts-tradingview-widgets";
import { CryptoCurrencyMarket } from "react-ts-tradingview-widgets";



function MarketIndex() {
    return (
      <div className="mt-16 flex justify-center"> {/* Add top margin and center the content */}
       <div className="w-full sm:px-4"> {/* Container with 70% width */}
          <div className="mb-4 mt-4">
            {/* <h2 className="text-2xl font-semibold mb-4">Ticker Tape</h2> */}
            <TickerTape colorTheme="dark"></TickerTape>
          </div>
          <div className="mb-4">
            {/* <h2 className="text-2xl font-semibold mb-4">Market Data</h2> */}
            <MarketData colorTheme="dark" width="100%" height={400}></MarketData>
          </div>
          <div className="mb-4">
            {/* <h2 className="text-2xl font-semibold mb-4">Cryptocurrency Market</h2> */}
            <CryptoCurrencyMarket colorTheme="dark" width="100%" height={400}></CryptoCurrencyMarket>
          </div>
          <div className="mb-4">
            {/* <h2 className="text-2xl font-semibold mb-4">Timeline</h2> */}
            <Timeline colorTheme="dark" feedMode="market" market="crypto" height={400} width="100%"></Timeline>
          </div>
        </div>
      </div>
    );
  }
  
 
  
export default MarketIndex;