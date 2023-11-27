import {Line, LineChart, ResponsiveContainer} from 'recharts';
import {Card, CardContent, CardHeader, CardTitle} from 'ui';

interface Props {
  items: Array<{
    date: string;
    count: number;
  }>;
  value: string;
  label: string;
  secondaryLabel: string;
}

export function StatCard({items, value, label, secondaryLabel}: Props) {
  return (
    <Card className="lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{secondaryLabel}</p>
        <div className="h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={items}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 1,
              }}
            >
              <Line type="monotone" dataKey="count" stroke="#fff" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
