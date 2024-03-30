export interface paramsInterface{
    Action:string,
    ResourceRecordSet:{
        Name:string,
        Type:string,
        AliasTarget?: {
            DNSName:string,
            EvaluateTargetHealth:boolean,
            HostedZoneId:string
        },
        CidrRoutingConfig?: {
            CollectionId: string, 
            LocationName: string 
          },
        Failover?: string,
        GeoLocation?: {
            ContinentCode?: string,
            CountryCode?: string,
            SubdivisionCode?: string
          },
        GeoProximityLocation?:{
            AWSRegion?: string,
            Bias?: number,
            Coordinates: {
              Latitude: string, 
              Longitude: string 
            },
            LocalZoneGroup?: string
          },
          HealthCheckId?: string,
          MultiValueAnswer?: false,
          Region?: string,
          ResourceRecords?: [
            {
              Value: string 
            },
          ],
          SetIdentifier?: string,
          TTL?: number,
          TrafficPolicyInstanceId?: string,
          Weight?: number,
    },
    Comment?: string
}
  
