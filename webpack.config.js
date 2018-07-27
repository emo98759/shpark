const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const port = process.env.PORT || 3000;

module.exports = {
    // webpack 설정 부분
    mode: 'development',  //설정 사항이 개발환경(development)인지 프로덕션(production)인지 선언
    entry: {//애플리케이션의 진입점(entry point) , 리액트 앱이 있는 위치와 번들링 프로세스가 시작되는 지점. 웹팩4에서는 웹팩3괍 반대로  entry생략할 수 있다.
        vendor: ['semantic-ui-react'], //메인 앱에서 특정 라이브러리를 빼내어 vendor로 만든다
        app: './src/index.js'
    },
    output: {  //컴파일된 파일의 저장할 경로를 알려준다.
        filename: '[name].[hash].js',
        //publicPath: '/'  // Hot reloading 은 중첩된 경로에서 동작하지 않는다.
    },
    devtool: 'inline-source-map',  //소스맵을 생성해 애플리케이션 디버깅을 도와준다.소스맵에는 여러 유형이 있으며 그중  inline-source-map은 개발시에만 사용된다.
    module: {  // 애플리케이션 내 포함되는 모듈을 정의한다. 우리의 경우 ESNext(바벨), CSS모듈에 해당한다.
        rules: [  // 각 모듈을 처리하는 방법을 설정한다.
            // 첫 번째 룰
            {//node_modules 디렉터리를 제외한 자바스크립트 파일을 찾은다음 babel-loader를 통해 바벨을 사용해 바닐라 자바스크립트로 변환. 바벨은 .babelrc 파일에서 설정내용을 읽는다
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            // 두 번째 룰
            {//css 파일을 찾고 style-loader와 css-loader로 css를 처리한다. 그다음 css-loader에게 css모듈, 카멜 케이스, 소스 맵을 사용할 것을 지시한다.
                //css모듈과 카멜케이스 > 이제 import Styles from './styles.css' 또는 import { style1, style2 } from './styles.css' 와 같이 구조 해체 문법으로 스타일 정의를 할 수 있다.
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            camelCase: true,
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [  //플러그인 설정 : html-webpack-plugin 은 다른 옵션을 가진 객체를 받는다. HTML 템플릿과 favicon을 지정한다. 이후 Bundle Analyzer 및 HMR 용 플러그인을 추가할 것이다.
        new webpack.HotModuleReplacementPlugin(), //HMR 업데이트시 브라우저 터미널에 표시해 알아보기 쉽게한다.
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            favicon: 'public/favicon.ico'
        })
    ],
    devServer: { //개발서버 설정 : host는 localhost로, port는 기본 port로 할당. 현제 기본 port 번호는 3000.  historyApiFallback을 true로, open을 true로 설정.
                    // 서버를 실행하면 브라우저가 자동으로 열리고 http://localhost:3000 에서 애플리케이션을 자동 실행행
        host: 'localhost',
        port: port,
        historyApiFallback: true,
        open: true,
        hot : true //서버에 HMR 작동을 허락한다
    },
    optimization: { //이 부분을 생략하면 webpack은 vendor로 애플리케이션을 분할할 것이다. 이부분을 추가하면 큰 번들 용량이 대폭 줄어든다
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    test: 'vendor',
                    name: 'vendor',
                    enforce: true
                }
            }
        }
    },
};