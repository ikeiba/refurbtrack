"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { X } from "lucide-react" // Necesitamos este icono
import { cn } from "@/lib/utils"

interface PricePoint {
  timestamp: string
  price: number
}

interface Series {
  name: string
  color?: string
  data: PricePoint[]
}

interface PriceHistoryChartProps {
  series: Series[]
  onRemoveSeries?: (seriesName: string) => void // Nueva prop para borrar
}

export default function PriceHistoryChart({ series, onRemoveSeries }: PriceHistoryChartProps) {
  
  // 1. PROCESADO DE DATOS (Igual que antes, con agrupación por hora)
  const processedData = useMemo(() => {
    // 1. RECOLECTAR TODOS LOS TIMESTAMPS CRUDOS
    // Primero necesitamos ver todos los momentos en los que hubo precios
    // para poder ordenarlos y decidir cuáles van juntos.
    const allRawTimestamps = new Set<string>()
    series.forEach((s) => {
      s.data.forEach((p) => allRawTimestamps.add(p.timestamp))
    })
    
    // Ordenamos cronológicamente (de más viejo a más nuevo)
    const sortedTimestamps = Array.from(allRawTimestamps).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    )

    // 2. CREAR MAPA DE NORMALIZACIÓN (Clustering)
    // Este mapa dirá: "Si viene la fecha X, úsala como si fuera la fecha Y"
    const timeMap = new Map<string, string>()
    
    // Definimos el "Umbral de Tolerancia". 
    // Si dos scrapes ocurren con menos de 90 minutos de diferencia, son la misma ronda.
    const THRESHOLD_MS = 90 * 60 * 1000; 

    if (sortedTimestamps.length > 0) {
        // El primer dato siempre inaugura un grupo
        let currentAnchor = sortedTimestamps[0]; 
        timeMap.set(currentAnchor, currentAnchor);

        for (let i = 1; i < sortedTimestamps.length; i++) {
            const current = sortedTimestamps[i];
            const prev = sortedTimestamps[i-1]; // Comparamos con el inmediatamente anterior
            
            // Calculamos distancia con el ANCLA del grupo actual
            const diff = new Date(current).getTime() - new Date(currentAnchor).getTime();

            if (diff < THRESHOLD_MS) {
                // Está cerca del inicio del grupo -> Pertenece al mismo grupo
                timeMap.set(current, currentAnchor);
            } else {
                // Está lejos -> Es una nueva ronda de scraping
                currentAnchor = current;
                timeMap.set(current, currentAnchor);
            }
        }
    }

    // 3. CONSTRUIR LOS DATOS FINALES PARA RECHARTS
    // Ahora agrupamos los precios usando nuestro mapa inteligente
    const dataGroups = new Map<string, any>()

    series.forEach((s) => {
      s.data.forEach((point) => {
        // Traducimos la fecha real a la fecha del grupo (el Ancla)
        const groupKey = timeMap.get(point.timestamp) || point.timestamp;
        
        if (!dataGroups.has(groupKey)) {
            dataGroups.set(groupKey, { timestamp: groupKey })
        }
        
        const entry = dataGroups.get(groupKey)
        entry[s.name] = Number(point.price)
      })
    })

    // 4. DEVOLVER ARRAY ORDENADO
    return Array.from(dataGroups.values()).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

  }, [series])

  if (series.length === 0) return null

  return (
    <div className="flex flex-col h-full w-full">
      
      {/* 2. LEYENDA INTERACTIVA Y PERSONALIZADA (Para borrar) */}
      <div className="flex flex-wrap gap-2 mb-4 px-2">
        {series.map((s, index) => (
          <div 
            key={s.name}
            className="flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium shadow-sm transition-all"
            style={{ 
              borderColor: s.color, 
              backgroundColor: `${s.color}15`, // Un fondo muy suave del mismo color (15% opacidad)
              color: s.color 
            }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.name}
            
            {/* Solo mostramos la X si NO es el primer elemento (el dueño de la página) */}
            {index !== 0 && onRemoveSeries && (
              <button 
                onClick={() => onRemoveSeries(s.name)}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                title="Eliminar de la comparativa"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 3. GRÁFICO */}
      <div className="flex-1 min-h-0"> {/* min-h-0 es clave para flexbox anidados */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            
            <XAxis
              dataKey="timestamp"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                 try { return format(new Date(value), "d MMM", { locale: es }) } catch (e) { return "" }
              }}
              padding={{ left: 20, right: 20 }} // <--- AÑADIR ESTO
              minTickGap={30}
            />
            
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}€`}
              domain={['auto', 'auto']}
            />
            
            <Tooltip
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))", 
                borderColor: "hsl(var(--border))",
                borderRadius: "8px" 
              }}
              labelFormatter={(label) => {
                try { return format(new Date(label), "d MMMM, HH:mm", { locale: es }) } catch { return label }
              }}
              formatter={(value: number) => [`${value}€`, ""]}
              // 4. AQUÍ ESTÁ EL ORDENAMIENTO DE MAYOR A MENOR EN EL TOOLTIP
              itemSorter={(item) => (item.value as number) * -1}
              separator="" // <--- AÑADIR ESTO (Quita los dos puntos)
            />
            
            {/* Quitamos la Legend de aquí porque ya hemos hecho la nuestra arriba */}

            {series.map((s) => (
              <Line
                key={s.name}
                type="monotone"
                dataKey={s.name}
                stroke={s.color}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls={true} 
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}