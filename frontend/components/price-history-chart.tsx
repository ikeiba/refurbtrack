"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

// Definimos la estructura de una "Línea" del gráfico
interface ChartSeries {
  name: string
  color?: string
  data: { timestamp: string; price: number }[]
}

interface PriceHistoryChartProps {
  series: ChartSeries[]
}

export default function PriceHistoryChart({ series }: PriceHistoryChartProps) {
  
  // Si no hay datos, mostramos mensaje
  if (series.length === 0 || series[0].data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No hay datos suficientes para mostrar la gráfica.
      </div>
    )
  }

  // TRUCO: Recharts prefiere un único array de objetos con claves dinámicas 
  // (ej: { date: '...', priceA: 100, priceB: 200 }).
  // Pero como nuestras series pueden tener fechas distintas (históricos diferentes),
  // es más seguro pintar líneas independientes.
  // Nota: Para que el eje X sea coherente, deberíamos unificar fechas, 
  // pero para este MVP pintaremos las líneas tal cual vienen.
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
        
        <XAxis 
          dataKey="timestamp" 
          type="category" 
          allowDuplicatedCategory={true} // Permite que cada línea tenga sus propias fechas
          data={series[0].data} // Usamos la primera serie como referencia base
          tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        
        <YAxis 
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}€`}
          domain={['auto', 'auto']} // Ajuste automático de escala
        />
        
        <Tooltip 
          contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
          itemStyle={{ color: "#111", fontWeight: 600 }}
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
          formatter={(value: number) => [`${value}€`]}
        />
        
        <Legend wrapperStyle={{ paddingTop: "20px" }} />

        {series.map((line, index) => (
          <Line
            key={line.name}
            data={line.data}
            type="monotone"
            dataKey="price"
            name={line.name}
            stroke={line.color || (index === 0 ? "#2563eb" : "#db2777")} // Azul (Principal) vs Rosa (Comparación)
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}