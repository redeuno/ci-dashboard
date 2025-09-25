import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AssinaturaType {
  name: string;
  value: number;
  color: string;
}

interface AssinaturasChartProps {
  data: AssinaturaType[];
  loading?: boolean;
}

const AssinaturasChart: React.FC<AssinaturasChartProps> = ({ data, loading = false }) => {
  return (
    <Card className="dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
          <Users className="h-5 w-5 text-pink-600 dark:text-pink-400" />
          Assinaturas Ativas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="h-12 w-12 border-4 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
          </div>
        ) : data && data.length > 0 && data.some(item => item.value > 0) ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.filter(item => item.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} serviços`, name]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {data.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-80 flex flex-col items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-lg font-medium mb-2">Nenhum serviço encontrado</p>
              <p className="text-sm">Os dados aparecerão quando houver agendamentos cadastrados</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssinaturasChart;