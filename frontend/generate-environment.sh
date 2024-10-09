# generate-environment.sh
mkdir -p src/environments
cat <<EOF > src/environments/environment.ts
export const environment = {
  production: ${PRODUCTION},
  apiUrl: 'API_URL',
  apiKey: 'API_KEY'
};
EOF
