# generate-environment.sh
mkdir -p src/environments
cat <<EOF > src/environments/environment.ts
export const environment = {
  apiUrl: 'API_URL',
  apiKey: 'API_KEY'
};
EOF
