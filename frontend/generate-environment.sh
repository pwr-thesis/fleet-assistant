# generate-environment.sh
mkdir -p src/environments
cat <<EOF > src/environments/environment.ts
export const environment = {
  oidcClientId: 'oidcClientId',
  apiUrl: 'API_URL',
  googleApiKey: 'GOOGLE_API_KEY'
};
EOF
