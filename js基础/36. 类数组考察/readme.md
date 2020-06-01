js 类数组对象

    https://juejin.im/post/5be561a6f265da613f2efb73

    > 类数组对象，就是指可以`通过索引属性访问元素`并且拥有` length 属性`的对象

    ```
    var arrLike = {
      0: 'name',
      1: 'age',
      2: 'job',
      length: 3
    }
    ```

    * 类数组对象与数组的区别

        * 类数组对象不能直接使用数组的方法

    * 如果类数组对象能够和数组一样使用数组的方法，应该怎么做

    ```js
    // 使用 call
    Array.prototype.push.call(arrLike, 'hobby');
    console.log(arrLike); // { '0': 'name', '1': 'age', '2': 'job', '3': 'hobby', length: 4 }

    var arrLikeStr = Array.prototype.join.call(arrLike, '&')
    console.log(arrLikeStr); // name&age&job&hobby

    // 使用 apply
    Array.prototype.push.apply(arrLike, ['hobby']);
    console.log(arrLike); // { '0': 'name', '1': 'age', '2': 'job', '3': 'hobby', length: 4 }

    var arrLikeStr = Array.prototype.join.apply(arrLike, ['&'])
    console.log(arrLikeStr); // name&age&job&hobby
    ```

    * 把类数组对象转换成真正的数组

    > 通过 `Array.prototype.slice` 或 `Array.prototype.splice`

    ```js
    // 使用 call
    console.log(Array.prototype.slice.call(arrLike,0));
    console.log(Array.prototype.splice.call(arrLike,0));  // 会改变原先的类数组对象

    ```