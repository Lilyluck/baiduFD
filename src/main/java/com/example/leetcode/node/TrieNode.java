package com.example.leetcode.node;

/**
 * @author green
 * @Description 字典数，26位字母
 */
public class TrieNode {
    /**
     * 当前的单词
     */
    public String value;
    /**
     * 当前结点数据
     */
    public Character data;
    /**
     * 子节点数据
     */
    public TrieNode[] nextNodes;

    public TrieNode(char c) {
        this.data = c;
    }

    public TrieNode() {
    }


    public static void createTrie(String[] words, TrieNode root) {
        for (String word : words) {
            TrieNode node = root;
            for (char c : word.toCharArray()) {
                if (node.nextNodes == null) {
                    node.nextNodes = new TrieNode[26];
                }
                if (node.nextNodes[c - 'a'] == null) {
                    node.nextNodes[c - 'a'] = new TrieNode(c);
                }
                node = node.nextNodes[c - 'a'];
            }
            node.value = word;
        }
    }
}
