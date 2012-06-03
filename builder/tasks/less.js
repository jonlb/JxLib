var util = require("util"),
    Promise = require("build/node_modules/promised-io").Promise,
    fs = require("fs"),
    Walker = require('build/node_modules/walker'),
    less = require("less");

module.exports.tasks = {
    less: function(options,config,logger){
        var p = new Promise(),
            count = 0;
        Array.from(options).each(function(opt){
            count++;
            logger.info("converting less files in directory tree: " + opt.source);
            var parser = new (less.Parser)({
                paths: ['.', opt.source + '/mixins']    
            });
            Walker(opt.source).filterDir(function(dir){
                return !(dir.test('^\.[\S\s]*$','i'));
            }).on('file', function(file){
                logger.info('processing file: ' + file);
                //parse and save the less file here
                if (file.contains('.less')) {
                    code = fs.readFileSync(file,'utf-8');
                    logger.info('code from file: ' + code);
                    target = file.replace('.less','.css');
                    logger.info('new target file: ' + target);
                    //compile it
                    try {
                        parser.parse(code,function(e, tree) {
                            //write it
                            fs.writeFileSync(target, tree.toCSS(), 'utf-8');
                        });
                    } catch (e) {
                        logger.info('error in less.render' + util.inspect(e));
                        throw e;
                    }
                }
            })
            .on('end',function(){
                count--;
                if (count == 0) {
                    p.resolve(true);
                }
            });
            
        });
        return p;
    }
};