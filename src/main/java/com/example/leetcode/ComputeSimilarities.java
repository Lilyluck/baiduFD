package com.example.leetcode;

import com.alibaba.fastjson.JSON;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * @author green
 * @Description 面试题 17.26. 稀疏相似度
 * 两个(具有不同单词的)文档的交集(intersection)中元素的个数除以并集(union)中元素的个数，就是这两个文档的相似度。
 * 例如，{1, 5, 3} 和 {1, 7, 2, 3} 的相似度是 0.4，其中，交集的元素有 2 个，并集的元素有 5 个。
 * 给定一系列的长篇文档，每个文档元素各不相同，并与一个 ID 相关联。它们的相似度非常“稀疏”，也就是说任选 2 个文档，相似度都很接近 0。
 * 请设计一个算法返回每对文档的 ID 及其相似度。只需输出相似度大于 0 的组合。请忽略空文档。
 * 为简单起见，可以假定每个文档由一个含有不同整数的数组表示。
 * <p>
 * 输入为一个二维数组 docs，docs[i]表示id 为 i 的文档。返回一个数组，其中每个元素是一个字符串，代表每对相似度大于 0 的文档，
 * 其格式为 {id1},{id2}: {similarity}，
 * 其中 id1 为两个文档中较小的 id，similarity 为相似度，精确到小数点后 4 位。以任意顺序返回数组均可。
 * <p>
 * 示例:
 * <p>
 * 输入:
 * [
 * [14, 15, 100, 9, 3],
 * [32, 1, 9, 3, 5],
 * [15, 29, 2, 6, 8, 7],
 * [7, 10]
 * ]
 * 输出:
 * [
 * "0,1: 0.2500",
 * "0,2: 0.1000",
 * "2,3: 0.1429"
 * ]
 */
public class ComputeSimilarities {
    /**
     * 暴力搜索，遍历
     * <p>
     * 执行时间1587ms  9%
     * 内存 55.8M  94%
     */
    public List<String> solution(int[][] docs) {
        List<String> result = new ArrayList<>();
        HashSet hashSet;
        for (int i = 0; i < docs.length; i++) {
            hashSet = new HashSet();
            for (int j = 0; j < docs[i].length; j++) {
                hashSet.add(docs[i][j]);
            }
            for (int j = i + 1; j < docs.length; j++) {
                int intersection = 0;
                int union = hashSet.size();
                //遍历第二个数组数据
                for (int k = 0; k < docs[j].length; k++) {
                    if (hashSet.contains(docs[j][k])) {
                        //交集
                        intersection++;
                    } else {
                        union++;
                    }
                }
//                ["0,1: 0.2500","0,2: 0.1000","2,3: 0.1429"]
                if (intersection != 0 && union != 0) {
                    String resultString = i + "," + j + ": " + new BigDecimal(intersection).divide(new BigDecimal(union), 4, RoundingMode.HALF_UP);
                    result.add(resultString);
                }
            }
        }
        return result;
    }

    /**
     * 先将数组排序在计算
     * 执行时间 905ms   19.53%
     * 内存消耗 53.3M   100%
     */
    public List<String> solution2(int[][] docs) {
        List<String> result = new ArrayList<>();
        for (int i = 0; i < docs.length; i++) {
            Arrays.sort(docs[i]);
        }

        for (int i = 0; i < docs.length; i++) {
            int[] docs1 = docs[i];
            for (int j = i + 1; j < docs.length; j++) {
                int intersection = 0;
                int[] docs2 = docs[j];
                int k = 0, m = 0;
                while (true) {
                    if (docs1[k] == docs2[m]) {
                        intersection++;
                        k++;
                    } else if (docs1[k] < docs2[m]) {
                        k++;
                    } else {
                        m++;
                    }
                    if (k >= docs1.length || m >= docs2.length) {
                        break;
                    }
                }
                if (intersection > 0) {
                    String resultString = i + "," + j + ": " +
                            new BigDecimal(intersection).divide(new BigDecimal(docs1.length + docs2.length - intersection), 4, RoundingMode.HALF_UP).toString();
                    result.add(resultString);
                }

            }
        }
        return result;
    }

    /**
     * 所有数据缓存，记录数据出现的一维下标。统计出现相同数据行的情况交集数
     * 执行时间  267ms  99%
     * 内存   64.3M  73%
     */
    public List<String> solution3(int[][] docs) {
        List<String> result = new ArrayList<>();
        int docLen = docs.length;

        Map<String, Integer> map = new HashMap<>();
        Map<Integer, List<Integer>> cache = new HashMap<>();

        for (int i = 0; i < docLen; ++i) {
            for (int n : docs[i]) {
                List<Integer> list = cache.get(n);
                if (list == null) {
                    cache.put(n, new ArrayList<>());
                    cache.get(n).add(i);
                } else {
                    for (Integer l : list) {
                        String key = l + "," + i;
                        if (i < l) {
                            key = i + "," + l;
                        }
                        Integer intersection = map.get(key) == null ? 1 : map.get(key) + 1;
                        map.put(key, intersection);
                    }
                    list.add(i);
                }
            }
        }
        for (int i = 0; i < docLen - 1; ++i) {
            for (int j = i + 1; j < docLen; ++j) {
                String key = i + "," + j;
                if (docs[i].length > 0 && docs[j].length > 0 && map.get(key) != null) {
                    String resultString = i + "," + j + ": " +
                            new BigDecimal(map.get(key)).divide(new BigDecimal(docs[i].length + docs[j].length - map.get(key)), 4, RoundingMode.HALF_UP);
                    result.add(resultString);
                }
            }
        }
        return result;
    }

    public static void main(String[] args) {
        int[][] docs = {{14, 15, 100, 9, 3}, {32, 1, 9, 3, 5}, {15, 29, 2, 6, 8, 7}, {7, 10}};
        ComputeSimilarities computeSimilarities = new ComputeSimilarities();
        List<String> solution = computeSimilarities.solution(docs);
        System.out.println(JSON.toJSONString(solution));
        List<String> solution2 = computeSimilarities.solution2(docs);
        System.out.println(JSON.toJSONString(solution2));
        List<String> solution3 = computeSimilarities.solution3(docs);
        System.out.println(JSON.toJSONString(solution3));
    }
}
