'use client';

interface Props {
  organizerId: string;
}

export function StripeAccountLinkSettings({organizerId}: Props) {
  return null;

  // return (
  //   <CardBase
  //     title="Connect Stripe"
  //     titleChildren={
  //       account ? null : (
  //         <Button
  //           onClick={createAccountLink}
  //           disabled={isCreating}
  //           isLoading={isCreating}
  //           size="sm"
  //           variant={'link'}
  //           className="p-0"
  //         >
  //           Connect
  //         </Button>
  //       )
  //     }
  //   >
  //     {account && (
  //       <div className="flex items-center gap-2">
  //         <div>
  //           <div>{`ID: ${account.id}`}</div>
  //           <div>{`Name: ${account.name}`}</div>
  //           <div>{`Email: ${account.email}`}</div>
  //         </div>
  //         <div className="grow" />
  //         <Badge className="bg-green-500 hover:bg-green-600">Linked</Badge>
  //       </div>
  //     )}
  //     {!account && <span>No stripe account is linked</span>}
  //   </CardBase>
  // );
}
