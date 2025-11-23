import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react';

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  description?: string;
  borderColor?: string;
  subStats?: Array<{
    icon: React.ReactNode;
    value: string | number;
    label: string;
  }>;
}



export const StatCard: React.FC<StatCardProps> = ({
  title,
  icon,
  value,
  description,
  borderColor = 'border-l-primary',
  subStats,
}) => (
  <Card
    className={`shadow border border-l-4 ${borderColor} transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg w-full max-w-full`}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs sm:text-sm font-medium text-primary truncate">{title}</CardTitle>
      <span className="shrink-0">{icon}</span>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="text-xl sm:text-2xl font-bold wrap-break-word">{value}</div>
      {description && <p className="text-xs sm:text-sm text-muted-foreground mt-1 wrap-break-word">{description}</p>}
      {subStats && (
        <div className="flex flex-col sm:flex-row flex-wrap items-start gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-muted-foreground">
          {subStats.map(
            (
              stat: {
                icon:
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactPortal
                      | ReactElement<unknown, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined;
                value:
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactPortal
                      | ReactElement<unknown, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined;
                label:
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactPortal
                      | ReactElement<unknown, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined;
              },
              index: Key | null | undefined
            ) => (
              <span key={index} className="flex items-center gap-1 min-w-0">
                {stat.icon}
                <span className="font-semibold">{stat.value}</span>
                <span className="truncate">{stat.label}</span>
              </span>
            )
          )}
        </div>
      )}
    </CardContent>
  </Card>
);
