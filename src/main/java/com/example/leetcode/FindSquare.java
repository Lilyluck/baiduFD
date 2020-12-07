package com.example.leetcode;

import com.alibaba.fastjson.JSON;

/**
 * @author green
 * @Description 面试题 17.23. 最大黑方阵
 * 给定一个方阵，其中每个单元(像素)非黑即白。设计一个算法，找出 4 条边皆为黑色像素的最大子方阵。
 * <p>
 * 返回一个数组 [r, c, size] ，
 * 其中 r, c 分别代表子方阵左上角的行号和列号，size 是子方阵的边长。
 * 若有多个满足条件的子方阵，返回 r 最小的，若 r 相同，返回 c 最小的子方阵。若无满足条件的子方阵，返回空数组。
 * <p>
 * 示例 1:
 * <p>
 * 输入:
 * [
 * [1,0,1],
 * [0,0,1],
 * [0,0,1]
 * ]
 * 输出: [1,0,2]
 * 解释: 输入中 0 代表黑色，1 代表白色，标粗的元素即为满足条件的最大子方阵
 * 示例 2:
 * <p>
 * 输入:
 * [
 * [0,1,1],
 * [1,0,1],
 * [1,1,0]
 * ]
 * 输出: [0,0,1]
 * @url https://leetcode-cn.com/problems/max-black-square-lcci/
 */
public class FindSquare {
    public int[] solution(int[][] matrix) {
        int r = -1;
        int c = -1;
        int maxSize = Integer.MIN_VALUE;

        int col = matrix[0].length;
        int row = matrix.length;
        for (int i = 0; i < row; i++) {
            for (int j = 0; j < col; j++) {
                if (matrix[i][j] != 0) {
                    continue;
                }
                int size = getMaxSize(i, j, row, col, matrix, maxSize);
                if (size > maxSize) {
                    maxSize = size;
                    c = j;
                    r = i;
                }
            }
        }
        if (r == -1 || c == -1 || maxSize <= 0) {
            return new int[]{};
        }
        return new int[]{r, c, maxSize};
    }

    public int getMaxSize(int r, int c, int row, int col, int matrix[][], int maxSize) {
        int size = 0;
        boolean flag;
        for (int k = c; k < col; k++) {
            if (matrix[r][k] != 0) {
                break;
            }
            size++;
        }
        if (r + size > row) {
            size = row - r;
        }
        while (size > 0 && size > maxSize) {
            flag = true;
            int rowLength = r + size;
            int colLength = c + size;
            int rightC = colLength - 1;
            for (int l = r; l < rowLength; l++) {
                if (matrix[l][rightC] != 0 || matrix[l][c] != 0) {
                    flag = false;
                    break;
                }
            }
            if (!flag) {
                size--;
                continue;
            }

            int downR = rowLength - 1;
            for (int n = c; n < colLength; n++) {
                if (matrix[downR][n] != 0) {
                    flag = false;
                    break;
                }
            }
            if (!flag) {
                size--;
                continue;
            }
            return size;
        }

        return size;
    }

    public static void main(String[] args) {
        int[][] nums = {{1, 0, 1}, {0, 0, 1}, {0, 0, 1}};
        int[][] nums1 = {{0, 1, 1}, {1, 0, 1}, {1, 1, 0}};
        //5,3,2
        int[][] nums2 = {{1, 1, 1, 0, 1, 1, 0, 1, 0, 0},
                {0, 1, 0, 1, 1, 0, 0, 0, 1, 1},
                {0, 0, 1, 1, 0, 0, 1, 1, 1, 0},
                {0, 1, 1, 1, 0, 1, 0, 0, 1, 0},
                {1, 1, 0, 1, 1, 0, 1, 0, 0, 1},
                {0, 1, 1, 0, 0, 0, 0, 1, 1, 0},
                {1, 0, 0, 0, 0, 1, 1, 1, 1, 1},
                {1, 0, 1, 0, 1, 0, 0, 0, 1, 0},
                {1, 1, 1, 1, 0, 1, 0, 1, 0, 0},
                {0, 0, 0, 0, 0, 0, 0, 1, 1, 0}};
        int[][] nums3 = {{0, 1, 1, 1, 0, 0, 1, 1, 0, 0},
                {0, 1, 1, 0, 1, 0, 1, 0, 0, 1},
                {1, 0, 0, 0, 0, 0, 0, 1, 0, 1},
                {0, 1, 0, 0, 0, 1, 0, 1, 1, 0},
                {0, 0, 0, 1, 1, 1, 1, 0, 1, 1},
                {0, 0, 0, 0, 1, 1, 0, 0, 1, 1},
                {0, 1, 1, 1, 1, 1, 1, 1, 1, 1},
                {1, 1, 1, 0, 0, 0, 0, 1, 1, 1},
                {1, 1, 1, 1, 0, 0, 0, 1, 0, 0},
                {1, 1, 1, 1, 0, 1, 0, 1, 1, 1}};
        FindSquare findSquare = new FindSquare();
        int[] solution = findSquare.solution(nums);
        System.out.println(JSON.toJSONString(solution));
        int[] solution1 = findSquare.solution(nums1);
        System.out.println(JSON.toJSONString(solution1));
        int[] solution2 = findSquare.solution(nums2);
        System.out.println(JSON.toJSONString(solution2));
        int[] solution3 = findSquare.solution(nums3);
        System.out.println(JSON.toJSONString(solution3));

//        int size = findSquare.getMaxSize(5, 3, nums2[0].length, nums2.length, nums2);
//        System.out.println(size);
    }
}
