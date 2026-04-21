package backend.connectin.web.dto;

import backend.connectin.web.resources.PostResourceDetailed;

import java.util.List;

public class FeedPageDTO {

    private List<PostResourceDetailed> items;
    private int page;
    private int size;
    private long total;
    private boolean hasMore;

    public FeedPageDTO() {
    }

    public FeedPageDTO(List<PostResourceDetailed> items, int page, int size, long total) {
        this.items = items;
        this.page = page;
        this.size = size;
        this.total = total;
        this.hasMore = (long) (page + 1) * size < total;
    }

    public List<PostResourceDetailed> getItems() {
        return items;
    }

    public void setItems(List<PostResourceDetailed> items) {
        this.items = items;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public boolean isHasMore() {
        return hasMore;
    }

    public void setHasMore(boolean hasMore) {
        this.hasMore = hasMore;
    }
}
