## Setup dev environment
1. install nodejs
2. `npm install`
3. `grunt` to dev, any change to src/rule, src/template will regenerate proxy.pac under directory dist.
4. `grunt deploy` to generate new pac file and deploy it onto github. 

## rule files
1. Line beginning with `#` is comment.
2. `.r` file is rule file, `HOSTS` section means block the whole host; `URLS` section to block specify url, of course which is regex.
3. `.m` file is module file, which is planned to use define what rules included into build. But now we don't use it.