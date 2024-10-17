# generate-environment.sh
mkdir -p src/environments
cat <<EOF > src/environments/environment.ts
export const environment = {
  oidcClientId: 'oidcClientId',
  apiUrl: 'API_URL'
};
EOF
