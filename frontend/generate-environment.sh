# generate-environment.sh
mkdir -p src/environments
cat <<EOF > src/environments/environment.ts
export const environment = {
  oidcClientId: '$OIDC_CLIENT_ID',
  apiUrl: '$API_URL',
  googleApiKey: '$GOOGLE_API_KEY'
};
EOF
