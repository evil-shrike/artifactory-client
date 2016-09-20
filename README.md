# Overview
The artifactory-client module provides API of working with [Artifactory](https://www.jfrog.com/artifactory/) via its [REST API](http://www.jfrog.com/confluence/display/RTF/Artifactory+REST+API).  
Also the module provides CLI tool (`art-client`).  

> The package in based on [artifactory-api](https://www.npmjs.com/package/artifactory-api) package by Christian Adam.

# CLI usage

# Programmatic usage

## Creating
For interacting with Artifactory you need to create a instance of ArtifactoryClient passing it the base url of your Artifactory.  
If base url of your Artifactory instance includes path you need to include it as well.  
```js
constructor(url: string, options?)
```
Options:
* strictSSL
Type: boolean
Default: false


Examples:
```javascript
var artifactory = new ArtifactoryClient('https://artifacts.company.org');
```

```javascript
var artifactory = new ArtifactoryClient('https://artifacts.company.org/artifactory', {strictSSL: true});
```


## Authentication
You need to provide basic http credentials when creating a new instance. Just provide username:password in base 64.
* Hint: you can quickly obtain the base64 of any string by opening a Chrome browser and typing this in the developer console:

  ```javascript
  btoa('user:password') //prints: "dXNlcjpwYXNzd29yZA=="
  ```

  Usage example:

```javascript
var artifactory = new ArtifactoryClient('https:<myServerURL>');
artifactory.setAuth("dXNlcjpwYXNzd29yZA==")
// or:
artifactory.setAuth("user", "password");
```

## API
All actions return a [Q Promise](https://github.com/kriskowal/q).

### getNpmConfig
### getEncryptedPassword
### createFolder
### deleteFolder
### deleteFile
### moveItem
### moveItems

### isPathExists(repoKey, remotefilePath)
Verifies if the path (file or folder) exists in the server. You need to provide the repoKey and the path in the server.

API: [RetrieveArtifact](http://www.jfrog.com/confluence/display/RTF/Artifactory+REST+API#ArtifactoryRESTAPI-RetrieveArtifact) but only asking for the **HEAD** instead of doing a **GET**.

Usage example:
```javascript
artifactory.isPathExists('libs-release-local', '/my/jar/1.0/jar-1.0.jar').then(function (exists) {
  if(exists){
    console.log('YES, file exists!');
  } else {
    console.log('NO, it\'s not there');
  }
});
```


### getFolderInfo
Provides all the info related to a folder as a json object. You need to provide the repoKey and the path to the file.
API: [FolderInfo](http://www.jfrog.com/confluence/display/RTF/Artifactory+REST+API#ArtifactoryRESTAPI-FolderInfo)

### getFileInfo(repoKey, remotefilePath)
Provides all the info related to a file as a json object. You need to provide the repoKey and the path to the file.

API: [FileInfo](http://www.jfrog.com/confluence/display/RTF/Artifactory+REST+API#ArtifactoryRESTAPI-FileInfo)

  Usage example:

  ```javascript
  artifactory.getFileInfo('repo','/org/acme/lib/ver/lib-ver.pom').then(function(fileInfoJson){
    console.log(JSON.stringify(fileInfoJson));
  });
  ```

  That would print to console something like this:

  ```json
  {
    "uri": "http://localhost:8080/artifactory/api/storage/libs-release-local/org/acme/lib/ver/lib-ver.pom",
    "downloadUri": "http://localhost:8080/artifactory/libs-release-local/org/acme/lib/ver/lib-ver.pom",
    "repo": "libs-release-local",
    "path": "/org/acme/lib/ver/lib-ver.pom",
    "remoteUrl": "http://some-remote-repo/mvn/org/acme/lib/ver/lib-ver.pom",
    "created": ISO8601 (yyyy-MM-dd'T'HH:mm:ss.SSSZ),
    "createdBy": "userY",
    "lastModified": ISO8601 (yyyy-MM-dd'T'HH:mm:ss.SSSZ),
    "modifiedBy": "userX",
    "lastUpdated": ISO8601 (yyyy-MM-dd'T'HH:mm:ss.SSSZ),
    "size": "1024", //bytes
    "mimeType": "application/pom+xml",
    "checksums": {
      "md5" : string,
      "sha1" : string
    },
    "originalChecksums":{
      "md5" : string,
      "sha1" : string
    }
  }
  ```
  All this info will be available in the *fileInfoJson* object that is returned as part of the promise resolution.


### uploadFile(repoKey, remotefilePath, localfilePath, forceUpload)
Uploads a file to artifactory. All you need to provide is the repoKey, the remote path where you want to upload the file and the local path of the file you want to upload. If the file already exists in the server it will fail unless you provide the forceUpload flag with a true value. In that case, it will overwite the file in the server.

API: [DeployArtifact](http://www.jfrog.com/confluence/display/RTF/Artifactory+REST+API#ArtifactoryRESTAPI-DeployArtifact)

Usage example:

```javascript
artifactory.uploadFile('libs-release-local', '/my/jar/1.0/jar-1.0.jar', '/Users/user/artifacts/jar-1.0.jar').then(function (uploadInfo) {
  console.log('UPLOAD INFO IS: ' + JSON.stringify(uploadInfo));
});
```
This would print to console the creation info:

```json
{
"uri": "http://localhost:8080/artifactory/libs-release-local/my/jar/1.0/jar-1.0.jar",
"downloadUri": "http://localhost:8080/artifactory/libs-release-local/my/jar/1.0/jar-1.0.jar",
"repo": "libs-release-local",
"path": "/my/jar/1.0/jar-1.0.jar",
"created": ISO8601 (yyyy-MM-dd'T'HH:mm:ss.SSSZ),
"createdBy": "userY",
"size": "1024", //bytes
"mimeType": "application/java-archive",
"checksums": {
  "md5" : string,
  "sha1" : string
},
"originalChecksums": {
  "md5" : string,
  "sha1" : string
}
}
```
All this info will be available in the *uploadInfo* object that is returned as part of the promise resolution.


### downloadFile(repoKey, remotefilePath, destinationFile, checkChecksum)
Downloads a file from a given repository/path into a specific file. You need to provide the repoKey, the remote path where the file is located and a destination file. The folder that will contain the destination file must exist! Additionally you can indicate whether you want to perform a checksum verification as part of the download or not.

API: [RetrieveArtifact](http://www.jfrog.com/confluence/display/RTF/Artifactory+REST+API#ArtifactoryRESTAPI-RetrieveArtifact)

Usage example:

```javascript
artifactory.downloadFile('repo', '/path/to/file', '/path/to/local/file', true).then(function (result) {
  console.log(result);
});
```
The result object returned as part of the promise resolution is just a string indicating the final result of the operation.


### downloadFolder(repoKey, remotePath, destinationFile, archiveType)
Download a folder as an archive from a given repository/page info specified file.
API: [RetrieveArtifact](http://www.jfrog.com/confluence/display/RTF/Artifactory+REST+API#ArtifactoryRESTAPI-RetrieveArtifact)

Parameters:
* repoKey: string - The key of the repo.
* remotePath: string - The path to a folder inside the repo.
* destinationFile: string - Absolute or relative path to a local file. The folder that will contain the destination file must exist.
* archiveType?: string Optional archive type, by default - 'zip'.
