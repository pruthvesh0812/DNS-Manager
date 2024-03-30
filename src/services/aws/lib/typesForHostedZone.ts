export type ListHostedZonesType =  Array<{
       Id: string;
       Name: string;
       CallerReference: string;
       Config: {
         Comment: string;
         PrivateZone: boolean;
       };
       ResourceRecordSetCount: number;
    }> | undefined;
  
   