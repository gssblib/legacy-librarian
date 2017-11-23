# GSSB Library Server Provisioning

## Bootstrap

```
curl -L https://bootstrap.saltstack.com -o bootstrap_salt.sh
sudo sh bootstrap_salt.sh
```

## Apply Salt State

```
sudo NODE_ENV=public|prod salt-call -c . --local state.apply
```

