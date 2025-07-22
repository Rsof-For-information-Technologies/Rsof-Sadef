using Google.Apis.Auth.OAuth2;

namespace Sadef.Application.Utils
{
    public static class FirebaseNotificationHelper
    {
        public static string GetAccessToken(string serviceAccountFilePath)
        {
            if (!File.Exists(serviceAccountFilePath))
                throw new FileNotFoundException("Firebase service account file not found.", serviceAccountFilePath);

            var json = File.ReadAllText(serviceAccountFilePath);

            var credential = GoogleCredential.FromJson(json)
                .CreateScoped("https://www.googleapis.com/auth/firebase.messaging");

            var token = credential.UnderlyingCredential.GetAccessTokenForRequestAsync().Result;
            Console.WriteLine($"Firebase access token Testing: {token}");
            return token;
        }
    }
}
