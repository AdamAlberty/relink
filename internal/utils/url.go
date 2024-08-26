package utils

import (
	"fmt"
	"net/url"
)

func MergeQueryParams(shortLink string, longLink string) (string, error) {
	// Parse the short link URL
	shortURL, err := url.Parse(shortLink)
	if err != nil {
		return "", fmt.Errorf("failed to parse short link: %v", err)
	}

	// Parse the destination URL
	longURL, err := url.Parse(longLink)
	if err != nil {
		return "", fmt.Errorf("failed to parse destination link: %v", err)
	}

	// Parse query parameters
	shortQueryParams := shortURL.Query()
	destQueryParams := longURL.Query()

	// Merge query parameters
	for key, values := range shortQueryParams {
		if _, exists := destQueryParams[key]; !exists {
			for _, value := range values {
				destQueryParams.Add(key, value)
			}
		}
	}

	// Set the merged query parameters to the destination URL
	longURL.RawQuery = destQueryParams.Encode()

	// Return the final URL
	return longURL.String(), nil
}
