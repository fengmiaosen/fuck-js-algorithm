
这道题不是工程题，是道算法题。求的是两个数组的最长公共子序列 (子序列要求顺序，交集不需要）。所以上面用一个filter一个includes或者indexOf的都是错的。

反例很简单。

var nums1 = [1]
var nums2 = [1,1]
或者

var nums1 = [1,1]
var nums2 = [1]
交集应该是[1]

跑一下你们的方法就能知道错了。

这道题两种思路，空间换时间，或者不用额外空间就提升时间复杂度。

空间换时间的思路是用个Hash表来存数组1的元素以及出现的个数（此处需要遍历n次，并存一个n级别的空间）。
遍历数组2，发现数组2里有Hash表里的值就存到Result数组里，并把Hash表内该值次数减一（为0之后就Delete）。如果不存在Hash表里，就跳过。这样时间复杂度就是(m+n)

不用额外空间，就用遍历n的时候，判断值在不在m里，如果在，把m里的该值push到Result数组里，并将该值从m数组里删掉（用splice）。这样就是不用额外空间，但是提高了时间复杂度。