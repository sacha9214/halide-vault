"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  AreaSeries,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type SeriesType,
  type MouseEventParams,
} from "lightweight-charts";

export interface ChartPoint {
  time: string;
  value: number;
  volume?: number;
}

interface TradingChartProps {
  coingeckoId?: string;
  yahooSymbol?: string;
  staticData?: ChartPoint[];
  color: string;
  height?: number;
  currentPrice?: number;
  onPriceLoad?: (price: number) => void;
}

const cache = new Map<string, { data: ChartPoint[]; exp: number }>();
const TTL = 5 * 60 * 1000;

async function loadStockData(ticker: string): Promise<ChartPoint[]> {
  const key = `stock:${ticker}`;
  const hit = cache.get(key);
  if (hit && Date.now() < hit.exp) return hit.data;

  const res = await fetch(`/api/stockchart?ticker=${encodeURIComponent(ticker)}`);
  if (!res.ok) throw new Error(`${res.status}`);
  const data: ChartPoint[] = await res.json();
  if (data.length === 0) throw new Error("empty");

  cache.set(key, { data, exp: Date.now() + TTL });
  return data;
}

async function loadCryptoData(id: string): Promise<ChartPoint[]> {
  const hit = cache.get(id);
  if (hit && Date.now() < hit.exp) return hit.data;

  const res = await fetch(`/api/chart?id=${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`${res.status}`);
  const data: ChartPoint[] = await res.json();

  cache.set(id, { data, exp: Date.now() + TTL });
  return data;
}

function fmtTooltipPrice(v: number): string {
  if (v >= 1000) return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
  if (v >= 1) return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(v);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 4, maximumFractionDigits: 6 }).format(v);
}

export function TradingChart({ coingeckoId, yahooSymbol, staticData, color, height = 280, currentPrice, onPriceLoad }: TradingChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const chartDivRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const areaRef = useRef<ISeriesApi<SeriesType> | null>(null);

  const [loading, setLoading] = useState(!!(coingeckoId || yahooSymbol));
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ChartPoint[]>(staticData ?? []);

  // Sync static data when prop changes (e.g. different card opened without full remount)
  useEffect(() => {
    if (!coingeckoId && !yahooSymbol && staticData && staticData.length > 0) {
      setData(staticData);
    }
  }, [staticData, coingeckoId, yahooSymbol]);

  // Fetch crypto data — cancelled flag prevents stale fetches from calling onPriceLoad
  useEffect(() => {
    if (!coingeckoId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    loadCryptoData(coingeckoId)
      .then(d => {
        if (cancelled) return;
        setData(d);
        setLoading(false);
        if (onPriceLoad && d.length > 0) onPriceLoad(d[d.length - 1].value);
      })
      .catch(() => { if (!cancelled) { setError("Real-time data unavailable"); setLoading(false); } });
    return () => { cancelled = true; };
  }, [coingeckoId]);

  // Fetch stock / commodity data from Yahoo Finance
  useEffect(() => {
    if (!yahooSymbol) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    loadStockData(yahooSymbol)
      .then(d => {
        if (cancelled) return;
        setData(d);
        setLoading(false);
        if (onPriceLoad && d.length > 0) onPriceLoad(d[d.length - 1].value);
      })
      .catch(() => { if (!cancelled) { setError("Real-time data unavailable"); setLoading(false); } });
    return () => { cancelled = true; };
  }, [yahooSymbol]);

  // Build chart
  useEffect(() => {
    if (!chartDivRef.current || data.length < 2) return;

    // Destroy previous
    chartRef.current?.remove();
    areaRef.current = null;

    const chart = createChart(chartDivRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(224,224,224,0.35)",
        fontFamily: "ui-monospace, monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.04)" },
        horzLines: { color: "rgba(255,255,255,0.04)" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "rgba(255,255,255,0.25)", labelBackgroundColor: "#1e1e1e" },
        horzLine: { color: "rgba(255,255,255,0.25)", labelBackgroundColor: "#1e1e1e" },
      },
      rightPriceScale: {
        borderColor: "rgba(255,255,255,0.06)",
        scaleMargins: { top: 0.08, bottom: 0.22 },
      },
      timeScale: {
        borderColor: "rgba(255,255,255,0.06)",
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true },
      handleScale: { mouseWheel: true, pinch: true, axisPressedMouseMove: { time: true, price: true } },
      height,
    });

    chartRef.current = chart;

    // Area series
    const area = chart.addSeries(AreaSeries, {
      lineColor: color,
      topColor: `${color}55`,
      bottomColor: `${color}00`,
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 5,
      crosshairMarkerBorderColor: "#fff",
      crosshairMarkerBackgroundColor: color,
      priceFormat: {
        type: "custom",
        formatter: fmtTooltipPrice,
        minMove: 0.000001,
      },
    });
    areaRef.current = area;
    area.setData(data.map(d => ({ time: d.time as `${number}-${number}-${number}`, value: d.value })));

    // Volume series (same pane, separate price scale)
    const hasVolume = data.some(d => d.volume && d.volume > 0);
    if (hasVolume) {
      const vol = chart.addSeries(HistogramSeries, {
        color: `${color}33`,
        priceFormat: { type: "volume" },
        priceScaleId: "vol",
      });
      chart.priceScale("vol").applyOptions({
        scaleMargins: { top: 0.82, bottom: 0 },
        visible: false,
      });
      vol.setData(data.map(d => ({
        time: d.time as `${number}-${number}-${number}`,
        value: d.volume ?? 0,
        color: d.value >= (data[Math.max(0, data.indexOf(d) - 1)]?.value ?? d.value)
          ? `${color}55`
          : `${color}33`,
      })));
    }

    chart.timeScale().fitContent();

    // Crosshair tooltip
    const handleMove = (param: MouseEventParams) => {
      const tip = tooltipRef.current;
      if (!tip) return;

      if (!param.point || !param.time) {
        tip.style.opacity = "0";
        return;
      }

      const seriesData = param.seriesData.get(area) as { value?: number } | undefined;
      if (!seriesData?.value) {
        tip.style.opacity = "0";
        return;
      }

      const dateStr = typeof param.time === "string"
        ? new Date(param.time + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
        : new Date((param.time as number) * 1000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

      const priceEl = tip.querySelector<HTMLElement>(".tt-p");
      const dateEl = tip.querySelector<HTMLElement>(".tt-d");
      if (priceEl) priceEl.textContent = fmtTooltipPrice(seriesData.value);
      if (dateEl) dateEl.textContent = dateStr;

      const w = wrapRef.current?.clientWidth ?? 500;
      const tipW = 160;
      const x = param.point.x + 14;
      tip.style.left = `${Math.min(x, w - tipW)}px`;
      tip.style.top = `${Math.max(param.point.y - 56, 6)}px`;
      tip.style.opacity = "1";
    };

    chart.subscribeCrosshairMove(handleMove);

    return () => {
      chart.unsubscribeCrosshairMove(handleMove);
      chart.remove();
      chartRef.current = null;
    };
  }, [data, color, height]);

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height }}>
      {loading && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(10,10,10,0.4)", zIndex: 5, borderRadius: 6,
        }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(224,224,224,0.4)", letterSpacing: "0.14em" }}>
            LOADING MARKET DATA...
          </span>
        </div>
      )}
      {error && !loading && (
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 5 }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.52rem", color: "rgba(224,224,224,0.25)", letterSpacing: "0.1em" }}>
            {error} · showing estimates
          </span>
        </div>
      )}

      <div ref={chartDivRef} style={{ width: "100%", height }} />

      {/* Floating tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 0.08s",
          background: "rgba(14,14,14,0.92)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 6,
          padding: "0.4rem 0.6rem",
          zIndex: 20,
          minWidth: 140,
        }}
      >
        <div className="tt-d" style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.45)", letterSpacing: "0.1em", marginBottom: 4 }} />
        <div className="tt-p" style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 700, color }} />
      </div>
    </div>
  );
}
