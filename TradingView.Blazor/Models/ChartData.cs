namespace TradingView.Blazor.Models;

public class ChartData
{
    /// <summary>
    /// Fill this object with chart entry data such as Ohlcv or PricePoint
    /// </summary>
    public IReadOnlyList<IChartEntry> ChartEntries { get; set; }
    
        
    /// <summary>
    /// Optional marker arrow to be displayed in addition to the primary chart data
    /// </summary>
    public IReadOnlyList<Marker> MarkerData { get; set; }
}