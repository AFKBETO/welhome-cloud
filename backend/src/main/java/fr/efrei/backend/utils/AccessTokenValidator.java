package fr.efrei.backend.utils;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AccessTokenValidator {
    private static RestTemplate restTemplate = new RestTemplate();

    private static HttpHeaders getRequestHeaderBearer(String bearerAuthorizationToken) {
        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(bearerAuthorizationToken);

        return headers;
    }

    public static boolean isTokenValid(String url, String accessToken) {
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>("{}", getRequestHeaderBearer(accessToken)), String.class);
        return response.getStatusCode() == HttpStatus.NO_CONTENT;
    }
}
