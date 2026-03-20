import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Fractran {

    public static int[] fractran(String program) {
        // Parse fractions
        List<int[]> fractions = new ArrayList<>();
        for (String part : program.split(",")) {
            part = part.trim();
            if (part.contains("/")) {
                String[] nums = part.split("/");
                int num = Integer.parseInt(nums[0].trim());
                int den = Integer.parseInt(nums[1].trim());
                if (num > 0 && den > 0) {
                    fractions.add(new int[]{num, den});
                }
            }
        }

        List<Integer> result = new ArrayList<>();
        long n = 2; // use long to avoid overflow in larger sequences

        final int MAX_STEPS = 10000;

        for (int step = 0; step < MAX_STEPS; step++) {
            if (result.size() >= 10) break;
            result.add((int) n);

            boolean updated = false;
            for (int[] frac : fractions) {
                int num = frac[0];
                int den = frac[1];
                if (n % den == 0) {
                    n = (n / den) * num;
                    updated = true;
                    break;
                }
            }

            if (!updated) {
                break;
            }
        }

        // Convert to int array
        int[] arr = new int[result.size()];
        for (int i = 0; i < result.size(); i++) {
            arr[i] = result.get(i);
        }
        return arr;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(fractran("3/2, 1/3")));
        System.out.println(Arrays.toString(fractran("3/2, 5/3, 1/5")));
        System.out.println(Arrays.toString(fractran("3/2, 6/3")));
        System.out.println(Arrays.toString(fractran("2/7, 7/2")));
        System.out.println(Arrays.toString(fractran("17/91, 78/85, 19/51, 23/38, 29/33, 77/29, 95/23, 77/19, 1/17, 11/13, 13/11, 15/14, 15/2, 55/1")));
    }
}
