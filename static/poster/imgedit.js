/**
 * 解析查询字符串
 * @param  {String} str 查询字符串
 * @return {Object}     解析后的查询字符串后的对象
 */
function query( str, _decode ) {

    var data = {},
        arr = [],
        uri = _decode !== false ? decodeURIComponent( str ) : str;

    if ( uri.indexOf( "?" ) != -1 ) {

        arr = ( uri.split( "?", 2 )[1] );

        if ( arr.length != 0 ) {
            
            arr = arr.split( "&" );
            var len = arr.length;

            //存储分解形如 name=value 的字符串为数组形式
            var nameValue;

            for ( var i = 0; i < len; i++ ) {

                nameValue = arr[i].split( "=" );
                data[ nameValue[0] ] = nameValue[1];

            }

            return data;
        }
    }

    return {};

}

//获取请求参数
var urlParams = query( window.location.href, false );

imageEditor( "init", urlParams );

imageEditor( "addCallBackFn", function( arr, index ) {

    // console.log(arr);

    // console.log(index);

});