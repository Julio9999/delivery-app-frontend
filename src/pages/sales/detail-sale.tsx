import { useNavigate } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { PageTitlePortal } from '@/components/layouts/page-title-portal';
import { SaleInfo } from '@/modules/sales/components/sale-info';
import { useSaleDetail } from '@/modules/sales/hooks/use-sale-detail';

export const DetailSalePage = () => {
  const navigate = useNavigate();
  const { sale, isLoading, isFromCache, notFound } = useSaleDetail();

  const goBack = () => navigate('/sales');

  return (
    <>
      <PageTitlePortal title="Detalle de venta" />
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <Button onClick={goBack} variant="outline" size="sm">
          Volver a ventas
        </Button>

        {isLoading && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Spinner className="size-6" />
            </CardContent>
          </Card>
        )}

        {notFound && (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="text-lg font-medium">Venta no encontrada</p>
              <p className="text-sm text-muted-foreground">
                No se encontró una venta con el ID especificado.
              </p>
              <Button onClick={goBack} variant="link">
                Ir al listado de ventas
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && !notFound && (
          <SaleInfo sale={sale} isLoading={isLoading} isFromCache={isFromCache} />
        )}
      </div>
    </>
  );
};
