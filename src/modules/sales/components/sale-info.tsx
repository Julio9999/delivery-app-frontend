import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import type { SaleDetail, SaleItem, SaleListItem } from '@/api/interfaces/sale';

interface SaleInfoProps {
  sale: SaleDetail | SaleListItem | null;
  isLoading: boolean;
  isFromCache: boolean;
}

function isSaleDetail(sale: SaleDetail | SaleListItem): sale is SaleDetail {
  return 'items' in sale && Array.isArray((sale as SaleDetail).items);
}

function formatCurrency(value: number): string {
  return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

function formatDate(value: string): string {
  try {
    return format(new Date(value), 'dd/MM/yyyy HH:mm');
  } catch {
    return value;
  }
}

export function SaleInfo({ sale, isLoading, isFromCache }: SaleInfoProps) {
  if (isLoading || !sale) {
    return null;
  }

  const hasFullDetail = isSaleDetail(sale);
  const items: SaleItem[] = hasFullDetail ? (sale as SaleDetail).items : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">ID de venta</p>
            <p className="font-mono text-sm font-medium">{sale.id}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{formatCurrency(sale.total)}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex gap-8">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Fecha de creación</p>
            <p className="text-sm font-medium">{formatDate(sale.createdAt)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Cantidad de items</p>
            <p className="text-sm font-medium">{sale.itemCount}</p>
          </div>
        </div>

        {!isFromCache && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800/30 dark:bg-amber-950/20 dark:text-amber-300">
            Los detalles completos solo están disponibles después de crear la venta.
          </div>
        )}

        {hasFullDetail && items.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Precio unit.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(item.subtotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
