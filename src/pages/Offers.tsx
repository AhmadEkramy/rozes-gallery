import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSpecialOffers } from '@/hooks/useSpecialOffers';
import { format } from 'date-fns';

export default function Offers() {
  const { offers, loading, error } = useSpecialOffers();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Offers & Promotions</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {offers.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>No active offers at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <Card 
                  key={offer.id} 
                  className="w-full transition-all hover:shadow-lg"
                  style={{ backgroundColor: `${offer.color}10` }}
                >
                  <CardHeader>
                    <CardTitle className="text-xl" style={{ color: offer.color }}>
                      {offer.title}
                    </CardTitle>
                    <CardDescription>
                      {offer.discount} Off
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {offer.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-gray-500">
                      Valid until: {format(new Date(offer.validUntil), 'PPP')}
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
