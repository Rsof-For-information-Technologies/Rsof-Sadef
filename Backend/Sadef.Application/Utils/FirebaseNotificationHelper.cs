using Google.Apis.Auth.OAuth2;

namespace Sadef.Application.Utils
{
    public static class FirebaseNotificationHelper
    {
        private static readonly string ServiceAccountJson = @"{
            ""type"": ""service_account"",
            ""project_id"": ""sadef-push-notifcation"",
            ""private_key_id"": ""334e08b65082a8af321f7c70f812377cbe51c0cd"",
            ""private_key"": ""-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCIY78k5RDU4PtT\nNuuDaQigfuwmG0jb9GS3+bwSJHXg7dk8Y2qp5Aa6e7SaSgGiHhrlL+YxIOx+eBzH\n5d/rzfa34CeY9p7GDrODrWQGo/bnp5gWCewN7IZbA9IMdlbiS0lgEk1ARrDdWSQq\nAQYtZhvY15UI5VDz1tOhDYXyMk4YaSH6Z4WxcHx5fcl2u9HPYBaFuydK0pGDz6ID\nbzW3f4ecj97aYglhHJ9VXKDpvyPsCTR4TETGtrpoVia1gkrSTpWyzh340H1ao+1o\nsu4+Q7xumXoZgOqVSBAtDEfOcaW7Hqs4bkQloymcjLOP+7rr+XW/ldsajjQJSd2u\nKQ0zBSrVAgMBAAECggEAEHfCt4i07I8xqU2DSD2hXgeVKdC3jl9G3fPYYnRmiz8M\nsL7sPREcQt324342DkYGR0/uQlZQV8DW8MfvroAS3wbAoTZ92zohMK/52NdpU3Un\n5tlR2CiL3GdssDaFrRMcC+6Jx04BwugldrDi9w5SJG97PjS5/occzGBeoOy0AzxZ\nTiT1LNVAS3caSCqYkYGhONbA6XqmOCipCQrwdxJuvxAVXeYhHiGmNeQdOUcsonf/\np6PP7IziVCkpVVCEmYmShaIWOLVNm86jSDFxodUexOxpY7OGsN2Hk+zfyXNyl6ug\nWNPYRyWTPFUcLWbskd1wVjbz1bNbFm2QtdJC6waoDQKBgQC9jVAvhU9rjInRXquX\n6kaKP2gIcTD4BCAF2/a4ACdw5bIUNn0z3k9phBNEioJOnXj+U/WWtzFGKg22Q3Rq\ngpH0lwJH18zZkry1P6M2QBEyloszIye6mXceVeGPI5Rh+oLFLbj1GmcWYdyrxoDl\npeUaDatD6sR0QRuur3kudeWBHwKBgQC4M4+kiQeiKYC1LoT+ErWfN7wcONtbfI0+\n/ZNseOiLpm/pLk+xCsBjSWX9DQTNfUJFnikT9QgHq0ryWuUl5gFoSsijaG4ZcN5q\nsw0BvwW2MmiX5yVQlOXcqu1kQEHo55X6R4YByboa/yYprNhc9tE4u98SXH387xQa\ngO+1aosRiwKBgAOmavrfSE474JOFjSxZuI4E9o3jEBxWh/9U4wVcC2ZjJfC5s+OB\nzmmrv2s8d5Hn+mJ7X2lNkcdWG/l8hwteBE1/cu3LPAiciMG8vfnXdf1RZNDRRnyT\nY/XTlYpaFwtj9YyyerNNlNqbe9Ja+jRx412DEd828B2E+3F7s4uvfYHlAoGBAJn4\nV4CEHkJZiMFqAjbScsiE8RNyH0HIydQ2aA2Kv29ED1WNpYVqZEhZ6Qtt327Y3hWN\nT+7jqfOnJf2RJuvX56NCp5WXzDgt1WzBAAVOpDqYxj77MoC6Ba2/nrFm2PES65WK\nRaSm945ran35gd2rXlWbDKqvb4yGV3qT/krZpSdjAoGATeEd5/mKhOVETCY2AdsW\n3DAikkpwPOFRRXjqZT044dzg0BSzJLD8XMJKG7SiwwehPnlsHRiqu0WRh9L0MAhy\nMWODpd8NFJyHZUzDgMNzKstW51i/AFw/4Jeys6hBTyUrS3XqUOAMIfi2SSxoHq77\nSufIqZJZiZFyxvsxt3w9laY=\n-----END PRIVATE KEY-----\n"",
            ""client_email"": ""firebase-adminsdk-fbsvc@sadef-push-notifcation.iam.gserviceaccount.com"",
            ""client_id"": ""115907357711011974221"",
            ""auth_uri"": ""https://accounts.google.com/o/oauth2/auth"",
            ""token_uri"": ""https://oauth2.googleapis.com/token"",
            ""auth_provider_x509_cert_url"": ""https://www.googleapis.com/oauth2/v1/certs"",
            ""client_x509_cert_url"": ""https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40sadef-push-notifcation.iam.gserviceaccount.com"",
            ""universe_domain"": ""googleapis.com""
        }";

        public static async Task<string> GetAccessTokenAsync()
        {
            if (string.IsNullOrWhiteSpace(ServiceAccountJson))
                throw new InvalidOperationException("Firebase service account JSON is not configured.");

            var credential = GoogleCredential.FromJson(ServiceAccountJson)
                .CreateScoped("https://www.googleapis.com/auth/firebase.messaging");

            var token = await credential.UnderlyingCredential.GetAccessTokenForRequestAsync();
            Console.WriteLine($"Firebase access token: {token}");
            return token;
        }
    }
}
