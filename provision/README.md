# GSSB Library Server Provisioning

## Fast Way: Bootstrap

```
wget -L https://raw.githubusercontent.com/gssblib/librarian/master/provision/bootstrap.py -O bs_librarian.py
python3 bs_librarian.py
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
app_dir: <app-path>
server_type: prod|public
smtp.user: <username|BLANK>
smtp.password: <password|BLANK>
```

## Apply Salt State

```
cd <app-path>/provision
sudo salt-call -c . --local state.apply
```

## Debug Output

```
sudo salt-call -c . --local -l debug ...
```


# Update Public Server

## Update software

```
$ ssh gssblib@library.gssb.org
$ bash
$ cd <app-path>/provision
$ sudo salt-call -c . --local state.apply
```

If the something in the provisioning changed, you should do the following
first:

```
$ ssh gssblib@library.gssb.org
$ bash
$ cd <app-path>/provision
$ git pull -r
$ sudo salt-call -c . --local saltutil.sync_all

```

By convention `app-path` is `/opt/gssblib/librarian` on the public server.

## Update data

This needs to be written when I have access to our server.

On the main library server execute:

```
sudo salt-call -c . --local state.apply update-public
```


# Managing Servers

All our servers are run using `supervisor`.

- To see the status of all running servers:

  ```
  supervisorctl status
  ```

- Manage a particular server:

  ```
  supervisorctl [start|stop|restart] <server-name>
  ```

  So for example, to restart the app server:

  ```
  supervisorctl restart app-server
  ```

- Manage all servers at once:

  ```
  supervisorctl [start|stop|restart] all
  ```
