import path from 'path'
import webpack from 'webpack'


const globals = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
}


export default {
  entry: './src/index',
  mode: process.env.NODE_ENV,
  devtool: 'none',

  output: {
    path: path.resolve(__dirname, 'example/node_modules/react-dnd'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    // libraryExport: 'default',
    // library: 'DND',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },

  externals: {
    'react': 'react',
    'react-dom': 'react-dom',
    'prop-types': 'prop-types',
  },

  plugins: [
    new webpack.DefinePlugin(globals),
    // new webpack.ProvidePlugin({
    //   react: 'react',
    // }),
  ],
}
