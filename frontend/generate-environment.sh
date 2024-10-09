# generate-environment.sh
echo "Creating environment.ts"
cat <<EOF > src/environments/environment.ts
export const environment = {
  apiUrl: 'API_URL',
  apiKey: 'API_KEY'
};
EOF