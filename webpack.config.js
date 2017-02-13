/**
 * Created by SPACEY on 2017/2/12.
 */
module.exports = {
    entry: {
        entry:"./src/main.js"
    },
    output: {
        path: __dirname+"/public",
        filename: "bundle.js"
    },
    devtool: 'eval-source-map',
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: "vue"
            }
        ]
    }
};