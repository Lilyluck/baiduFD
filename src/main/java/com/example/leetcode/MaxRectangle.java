package com.example.leetcode;

import com.alibaba.fastjson.JSON;
import com.example.leetcode.node.TrieNode;

import java.util.*;

/**
 * @author green
 * @Description 面试题 17.25. 单词矩阵
 * 定一份单词的清单，设计一个算法，创建由字母组成的面积最大的矩形，
 * 其中每一行组成一个单词(自左向右)，
 * 每一列也组成一个单词(自上而下)。
 * 不要求这些单词在清单里连续出现，
 * 但要求所有行等长，所有列等高。
 * <p>
 * 如果有多个面积最大的矩形，输出任意一个均可。一个单词可以重复使用。
 * <p>
 * 示例 1:
 * <p>
 * 输入: ["this", "real", "hard", "trh", "hea", "iar", "sld"]
 * 输出:
 * [
 * "this",
 * "real",
 * "hard"
 * ]
 */
public class MaxRectangle {
    TreeMap<Integer, Set<String>> map = new TreeMap<>(Comparator.reverseOrder());
    String[] resultWord;
    Integer maxArea = 0;
    TrieNode root = new TrieNode();

    public String[] solution(String[] words) {
        TrieNode.createTrie(words, root);
        for (String word : words) {
            Set<String> wordSet = map.get(word.length());
            if (wordSet == null) {
                wordSet = new HashSet<>();
            }
            wordSet.add(word);
            map.put(word.length(), wordSet);
        }

        List<String> checkWord;
        for (Map.Entry<Integer, Set<String>> entry : map.entrySet()) {
            checkWord = new Stack<>();
            dfs(entry.getValue(), checkWord, 0, entry.getKey());
        }
        return resultWord;
    }

    public void dfs(Set<String> alternativeSet, List<String> checkWord, Integer index, Integer rowLength) {
        if (index.equals(rowLength)) {
            return;
        }

        for (String word : alternativeSet) {
            checkWord.add(word);
            boolean[] booleans = preValidMatrix(checkWord);
            int size = checkWord.size();
            if (!booleans[0]) {
                checkWord.remove(size - 1);
                continue;
            }
            if (booleans[1]) {
                int areaSize = size * rowLength;
                if (areaSize > maxArea) {
                    maxArea = areaSize;
                    resultWord = new String[size];
                    checkWord.toArray(resultWord);
                }
            }
            dfs(alternativeSet, checkWord, index + 1, rowLength);
            checkWord.remove(size - 1);
        }
        return;
    }

    /**
     * boolean[0]  表示是否存在字符串
     * boolean[1]  表示是否都是子节点
     */
    public boolean[] preValidMatrix(List<String> checkWord) {

        boolean nextFlag = true;
        int length = checkWord.get(0).length();
        for (int i = 0; i < length; i++) {
            TrieNode nextNode = root;
            for (String word : checkWord) {
                if (nextNode.nextNodes == null) {
                    return new boolean[]{false, false};
                }
                int index = word.charAt(i) - 'a';
                if (nextNode.nextNodes[index] == null) {
                    return new boolean[]{false, false};
                }
                nextNode = nextNode.nextNodes[index];
            }
            if (nextNode.value == null) {
                nextFlag = false;
            }
        }
        return new boolean[]{true, nextFlag};
    }

    public static void main(String[] args) {
//        String[] words = {"this", "real", "hard", "trh", "hea", "iar", "sld"};
//        String[] words = {"lcauj", "mdlby", "myulp", "yvkqn", "usajk", "rpj", "bojvf", "ukmkb", "afqbhs", "j", "ebe", "yacov", "wsaep", "zdk", "wziqrdd", "pcjfn", "nlrehaq", "dasrc", "lruvq", "dvca"};
        String[] words = {"cwsmqtaausjakauhujlpgjwpapsyunylpivxzbbdkxfxmeoypt", "n", "gd", "ib", "zj", "uw", "fg", "nr", "qp", "fb", "vq", "gz", "un", "tl", "gn", "bshvfxaadfogxjjgmjuwijdcpnluaztzyyzhwkkpsznvilhhcc", "bg", "zb", "qc", "rs", "jj", "khkxfuyqkfmrmqnxkbokatfkaplbdallpjdryysfrqbjuzatqf", "ju", "iq", "hx", "zkvygirllpckgxwctgiyzbcuffnqolmbghvzaejzpqckrmjzwu", "aj", "mn", "ad", "oa", "kr", "bs", "mh", "pe", "ce", "xn", "jc", "ha", "zk", "gf", "xw", "ku", "ll", "fn", "ii", "gw", "yu", "up", "xh", "lo", "bsjsjppqxtqwrsxeyamophripgayjuzupkbqmkqmeqjkilcubh", "ne", "z", "bv", "ja", "rv", "lh", "dq", "ve", "jk", "qu", "zw", "lw", "aw", "rm", "bb", "xi", "rq", "zt", "js", "xu", "kw", "ro", "sf", "by", "gb", "mu", "jz", "gi", "boquvjhgadilhsbxhjtlmmutmnuttxugmhafppojfgbxghabuy", "yp", "lg", "cu", "ct", "mw", "xk", "sl", "zf", "eh", "so", "sp", "kp", "qz", "ty", "dy", "dz", "jt", "ey", "yt", "ih", "iwdggfxtdgklqpxdsarqexjbgepkdbkmnvdzbmdudhpjbngdxp", "hf", "mx", "uouzqwjkwdzvqfdhzpfvzpeajfkvtxdkcrwhvbqbhlqshyaybh", "ef", "ir", "adktqiniltegtvohcunbbxwzpmypkgodihutzinwiufbegevqc", "bh", "dm", "fk", "uk", "ae", "nm", "qk", "toilgaddlgxypkpvfpkctfyiudjcbjpfedgjmvsfrenrvroxdi", "ao", "bthhjsqqrqjubfivllsydjmmwpjlymynhqpofwlayzxwksicuu", "tjecqwbnfgnpqaqkfkyailypqaubuqwcmhjimphfazbroagzyb", "xr", "gs", "r", "rn", "oiikbjjpjngxprbkkerocamygvghxwxboyxafyumexsyycsfcu", "sm", "ij", "fj", "ta", "fe", "ox", "rz", "cg", "vv", "cz", "pv", "uj", "em", "rl", "uv", "vy", "yzvaqlpeuafqfrgdxnsrtsizleobksnijtrvhcvjxzrvvwhlzj", "wl", "nu", "io", "bm", "lmkrzmfvhaidusnztyjdxchgthqabzerrnbysboyauwuiqgnrj", "pp", "whqplhrluofemarlwgvonyoivmkhaaugqfgifdpxyufaiikqaq", "cb", "ri", "ym", "lu", "pcgamtwwpqyokvdzimjmeompemhxewwjjmhywfinsjmmrrmnbi", "ncqfjjreumidraarkycprwzkdudpzkecyzkcyaxuuvhnfjfrtn", "to", "mr", "bycjuhplzcjrscepphwcccalrosgonyzgexlojtshileqceyyt", "sn", "xp", "kf", "ul", "pb", "iv", "ea", "ap", "su", "th", "kg", "ysukcysqdilqemxikiqynsifdeiblrvznedfrlalmzczqywmqv", "lj", "xz", "ra", "fo", "iy", "mm", "zu", "pwjpjxirlqswexleoeotuqudzpseowuqjihmbfmlepgquixppa", "ya", "dg", "lktvueuukxahguvplyocaoyqspfqvwgmrznztlaefxspicorpe", "dw", "nbznkghfiljhsvuiznshnzwkpuukikbzeyeuqrmthdrkncmjiv", "vr", "jh", "ly", "co", "bt", "bl", "wv", "er", "wd", "ye", "mi", "ny", "hy", "nz", "ip", "wk", "hn", "asaplbgmfnfaycpddojdcliwvuylsoiefsmkaazjzherdjbxus", "tr", "st", "sa", "ke", "ee", "wh", "px", "ws", "ng", "qflxhbcepgukmlsyeneiuvagdnpyallkepgniutddpkrhpsecr", "jl", "cy", "av", "pt", "hj", "rk", "kd", "gx", "kk", "esfpdztmjtnbglsslxvwkyrkrhwybbwhataverbwkqghupczvo", "qv", "vo", "xc", "gr", "ml", "uf", "hq", "hdhqghtxfhmrmdpmzdaylngtgoqznqaztchfanvumqdraxeixq", "ak", "bz", "yk", "rpuwhkpibuypilyabjnqnekaptlypkgxozbjvozptessyyvicr", "lb", "yx", "gqovsmbldqwfyroyyweeukudtxikqatyauguorjvgzrppjydtl", "da", "dn", "du", "atsbxpvmjtcernkghoznhgvslekssoigjnneooveoruaqgyytn", "qg", "li", "py", "tw", "dj", "if", "ns", "eq", "ni", "si", "tx", "as", "at", "sy", "jx", "in", "mp", "uzlwwhtvmfilekqrliftjgnqxnjrnsltcywobftyfsaxiazlqz", "xf", "zsnuzoiqeezwujyngvppjofnksppakejmlgrbknlpqhckeungv", "ux", "uu", "jhxynhixxbrrkufmtxdjikkevrvntsgngttgudondepizpnikd", "rf", "pj", "rc", "m", "nh", "zs", "am", "jd", "wg", "ms", "bw", "kx", "ka", "yn", "tg", "gj", "fi", "krstgziiqabggvvufvuszmsyiiaxdwzawrbozbrvafuefoglqs", "te", "aa", "jg", "nf", "yw", "yq", "zm", "nt", "en", "rucggdxdkynxyvkhvbyanotbtqbfzpzyavzbkahjgpfjllzyef", "d", "kj", "elhfspkxdxqnpmpkdcgmosmglcdcgvqwbrxfzmlaurtvaythjk", "kq", "vc", "ho", "wj", "xq", "ic", "ev", "wy", "tc", "fooqakmfhzcsotjjkozdbijsoetdwqiktlisrstduwlnmksslh", "uz", "el", "hw", "gp", "np", "ph", "be", "dd", "mo", "lc", "va", "tq", "vl", "ln", "az", "tz", "dkidytafkhhlbmdhzkgqmcvctbafroiitafzwoyoohkzhhikie", "v", "xx", "jf", "rfzndcdrshuillnjwrttsorsjqemazazpeifkoecqkvewbtbth", "us", "cj", "mv", "fl", "qj", "ck", "bk", "s", "ls", "wo", "htfmmbnstvtfixgolzkebgjxdtimcvnjiddkzokkuoebptxhuo", "rw", "mz", "vu", "it", "wn", "hz", "xmgsracbzttbwqpiwpflflhvmcjedvnrwxxptjbifdstrpipwv", "wm", "yb", "tu", "cd", "ds", "bu", "db", "gadtwqkazgwellbnmhirhcknahqxeiqgmdgumtujnkedlufyjs", "vlmqrilyscywjlytqzvogakjypnksnhhmovdgikqcbjtfescug", "t", "nc", "yr", "ch", "i", "rd", "eb", "pq", "xy", "do", "hu", "c", "kjxhwupoxpqtcgafzyxmceippseyqwowdgxacppmwljsreiqwk", "k", "vb", "df", "sq", "ou", "pc", "tn", "yg", "eg", "wt", "je", "mt", "vi", "ob", "wu", "os", "atlqerdjdszzmyqwutkcixujbnymgpjrssmadscnxokzbvalge", "ac", "xo", "cm", "za", "im", "gu", "jnwpdxbterxxgqsifspvhtjkrrjrzsbkmkjpbxgtvxghaeovem", "nb", "hp", "fhguuzpuricbknarvfvuuaiqjuoneprtedxhokkoomnpyzrffk", "ze", "oc", "xb", "o", "hc", "yy", "qw", "hv", "sc", "bx", "ci", "ax", "sx", "uh", "au", "ut", "ld", "y", "x", "eu", "kn", "go", "pz", "hk", "nl", "po", "mc", "ivhfelbyrrdjtxtdilqhhxpwyeuusgrrewzggafnkwqxdhwqnp", "lfprlmqoqyaidlggysrjvraskrfaihsvnlojvcxdkxwqsujmmc", "b", "aq", "ti", "ar", "vqtrekspbphuhdjmvbrbrsbjnwxwefsaujonueezvgsgwshctk", "jdjikdnrfuynqdenupurxwwxvdrenuwznduourgrkfzwxsucob", "p", "hjzxxhlvpmrdcgomiaydnmmkqyrawxhczldrdmqhzzmslpfzvz", "dr", "vs", "cv", "zg", "on", "yf", "pa", "gupimkaxzmfktkzdctinmhlimdfcxhipsmdoluodlbvkyhcmki", "flbabfhawdaqlwvpcstuikgcjkdqknfcmopnqtvpussgflmeqb", "f", "oy", "sr", "reoukvhpfgzkdsimjuifwmyrybmwmuoavkfdsijwlugjhyfimd", "xsqxmaanlrljzihrgpguewkbqksrzhgkonlbfpmudiubernymq", "kveomwtmyfyfnucdcphwqfmmmifhibnbogbwzazulbqbstbrzk", "h", "or", "tk", "xm", "ex", "og", "lt", "q", "e", "ykypmlotoztrgvwnpxuzhvawbkterpdbjcmtbamvgeahgzdgsq", "xa", "na", "zp", "qa", "ru", "sd", "gv", "zupodigekkqqpzxzgqvzziejimhrbokysmuhsafjpjbwktnuhl", "jjutatmjaydqkppqzmlvpgqpuowfkdqblyipivdvmzjrtskdlu", "iz", "yd", "sk", "vk", "rx", "hg", "gk", "hr", "ekciqajslpdscierruoyuguajljprqvtknplayirfsdjqfpidw", "om", "ub", "xd", "km", "ez", "he", "dx", "ig", "id", "pd", "qhegnofrraudcxwzdfxmheaersybvxpgocgsazukleuvafpmuj", "wa", "qt", "cw", "no", "lp", "wb", "ql", "yzkahsewrhfriyjbbuwnaaglygppsstpqfgifsfeakptocpsfj", "wi", "iu", "bo", "ge", "gh", "cf", "wf", "qemoqpltvoneqrgrmtouakbuonlcnfmfmheuicsasqwhmorwvf", "gm", "ie", "rh", "a", "pi", "rkilafbvqwenffovvgebfpnqdtqjxfqtmygaimsrxratvuqqxk", "nd", "pu", "vz", "uo", "rb", "fs", "yoprekcfrmetsdrkjinmhhdpkmcqmvtgkaqknvbpcbhgmsqehe", "opekcclbtawwhvemtmstzalhfkjhxbavgagjmlgwhqktcoosst", "bf", "wzsymzwxkbkgjxziqhxezkfyfmlmtcaphqxmfdlucocftlgkdj", "ud", "fq", "ur", "vd", "nq", "nzavtdsdxafxrihxsuaxnkcslohgevipbqivtpmiipaprvukfp", "fr", "bi", "obcrtojfysapvcpmfpchrypkvcwbfszaoivkbaoruftxblklmj", "zd", "oe", "nw", "dh", "yc", "jo", "vkgsqujvizliryrtqbugstjizernuxctirsvcfeqdkvlwpvsad", "jr", "br", "samdncvzklkbpqpkitzikypiiumlahfwsjacywxxidckgqnfgc", "ok", "fv", "rj", "ed", "qx", "oz", "bq", "fhlpatrkdqzpvcedjrjdutdcurwiencuimpkkjtcjwkoqtlpep", "uc", "tb", "ts", "es", "vg", "lx", "lv", "oi", "tt", "zr", "zo", "eriudaxijfznacglrhtxyyhkdhqzqqpcnofyrsddmioknzlerm", "jm", "jb", "od", "hm", "qy", "klmzkhdjqkvibelzkgzjdxzqeqznfpmerbezfhofbpsxuxqzrw", "ua", "vm", "mk", "hb", "zy", "pm", "iw", "dc", "la", "vp", "zl", "lqkylbwdmirzskccrhfwspqrpqbwedwgrjixgyiqtelguguepv", "zxhaiovtaskhvywxxxsvkwqujfmknklpondzwovuhwnszwkrvn", "jv", "fm", "ps", "wz", "jq", "sv", "vh", "nv", "pqovwnffwqsgdhnsckeqmbuhdlqwpkglwqbpbsrkxpfbanitsm", "ia", "jy", "vw", "lz", "nj", "uq", "hs", "wp", "qf", "se", "qe", "ab", "yi", "hhblsevefjnqeekzdyjuvubhifusxmqqngpcssobiabmjevvkp", "dp", "dfedkaivixvydogxxiqftbpzjesmjtilwitumfpxrjpmllymwe", "vf", "ol", "qn", "sw", "bc", "oq", "ky", "il", "tv", "xj", "zz", "eo", "vt", "bd", "md", "xg", "copaksgibhlhkpqxsugbseomulcglhkvgidgecmnemtfqcxcqb", "zq", "fp", "ff", "yv", "qo", "tm", "kv", "eqmjuybpsfxmbypqeovnmuhqsslparumvkvkrzkgomvgoanalt", "yj", "et", "adzxwpqbkythwjrjeqnjxtfiviyscvbymxquwhnkmjbwocxkzu", "pr", "lm", "lf", "ue", "xe", "lq", "kb", "kl", "ba", "cc", "nk", "nx", "sz", "jn", "ei", "nn", "uy", "an", "hi", "yz", "fa", "zi", "xt", "ji", "yh", "xl", "qm", "cr", "yl", "mq", "rt", "pl", "cp", "cs", "fz", "ug", "lr", "zikimyhqdalrwsxgagetoaofqlvmjlomwpkrnzurpmswuylhaq", "dqkswyrkfhjmezwxqvqwkbqjgqjfnwmmxrbfglmkmjbdzuzcsa", "oo", "lk", "tf", "pg", "cl", "yo", "ww", "vj", "u", "le", "ca", "kh", "gg", "mvgkxfembpprqvyantbskhbycclvnwmeskguxlmeceqraqpbci", "gq", "qb", "jw", "kc", "ej", "bp", "qq", "ov", "fh", "we", "vn", "jp", "ah", "me", "fx", "cx", "l", "ko", "wr", "tj", "fdrgfycjxzruwaanmyhaohwlfypvmkpqxzknhbpwbnwyhghzls", "mg", "my", "ziuibvhguhwziomtxbleugfaigpgmduvhfdxbvvvgeoagxsllp", "ai", "tbqtjiwwqftmhwwvauzzicybdvulksastulcquuokpqerpgqje", "gc", "zv", "taxyfiiyapfnqaifvahxmsgcorihsildysshgbxucxmogouwtl", "tfgeigfqowcgnoxyutsnsrymkoshyeeuzvluujkuiotpjopqgj", "bycdykpmtsryetqzsblkjfzuxwczpthgyclhlxhcmpevnrnmhp", "dl", "qi", "oh", "ht", "wx", "is", "sg", "wq", "ix", "of", "pk", "sh", "zwbenudxmnnseibttpybkxmakarngnkoeqdeifaxvfebaospkx", "zc", "hd", "bj", "hh", "vtzizanfmdkxklnuxloiqvsqplivyyvxvcpnucyoxedlacatwe", "gy", "ot", "oj", "fy", "pn", "mj", "dk", "vx", "fc", "pw", "kz", "ss", "ys", "ow", "ec", "al", "cq", "xv", "de", "zh", "w", "zn", "mb", "ay", "ek", "td", "cbnvjoixfeuupomhqjjktmfmfaawxkrveqvpvjkrdlptyellac", "kt", "qh", "fd", "ft", "ma", "qd", "dt", "wc", "zx", "szsuhmftaarehqcnsmtxnciptadokmohhguizcbxmuihxajnou", "rg", "ew", "qr", "rr", "ndqobdpgnjahrnaorbgrubqxpgiabnxwkymjvpgezlvsnvyxpe", "re", "tp", "ag", "ki", "pf", "gl", "ks", "fw", "gt", "ep", "j", "ga", "tvberqlfknpumimdglrjhoaocuyabqtznoewsderntuvdcpymd", "swbdzkzikrulrmxpiaukijfxlvrxmwdojsudqftfzlwehkeddd", "rp", "sb", "di", "um", "fu", "hl", "djgbkaciyeracnpljhpqhjbpdlqcdfhovlhaignnaihbfuiskr", "dv", "op", "g", "ui", "ry", "sj", "ik", "bn", "af", "mf", "cn", "xs", "qs"};
        Runtime runtime = Runtime.getRuntime();
        runtime.gc();
        long l1 = runtime.freeMemory();
        long millis1 = System.currentTimeMillis();
        MaxRectangle maxRectangle = new MaxRectangle();
        String[] solution = maxRectangle.solution(words);
        System.out.println(JSON.toJSONString(solution));
        long millis2 = System.currentTimeMillis();
        long l2 = runtime.freeMemory();
        System.out.println(l2 - l1);
        System.out.println(millis2 - millis1);

    }
}
