module.exports = {
  entry: {
    'knode-app':'./src/knode-app.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },
  module: {

    rules: [
      {
        loader: 'babel-loader',
        test:[/\.js$/,/\.jsx$/],
        exclude :[/node_modules/],
        options: {
          presets: ['babel-preset-env','babel-preset-react'],
          plugins:[
            'babel-plugin-transform-runtime'
          ],
          cacheDirectory:true
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
          test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }

    ]
  }
}
