# GSSB Library Server Provisioning

## Fast Way: Bootstrap

```
curl -L https://raw.githubusercontent.com/gssblib/librarian/master/provision/bootstrap.py -o bs_librarian.py
sudo python3 bs_librarian.py
```

## Manual Way

### Clone the repository

```
git clone https://github.com/gssblib/librarian.git
```

### Bootstrap Salt

```
curl -L https://bootstrap.saltstack.com -o bootstrap_salt.sh
sudo sh bootstrap_salt.sh
```

### Setup Grains

Create the file `<app-path>/provision/grains` and add the following contents:

```
app_dir: <app-path>/provision/grains
server_type: prod|public
smtp.user: <username|BLANK>
smtp:password: <password|BLANK>
```

### Apply Salt State

```
cd <app-path>/provision
sudo salt-call -c . --local state.apply
```
