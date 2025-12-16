-- Create function to update reviews count
CREATE OR REPLACE FUNCTION public.update_tour_reviews_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tours 
    SET reviews_count = (SELECT COUNT(*) FROM reviews WHERE tour_id = NEW.tour_id)
    WHERE id = NEW.tour_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tours 
    SET reviews_count = (SELECT COUNT(*) FROM reviews WHERE tour_id = OLD.tour_id)
    WHERE id = OLD.tour_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for insert
CREATE TRIGGER on_review_insert
AFTER INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_tour_reviews_count();

-- Create trigger for delete
CREATE TRIGGER on_review_delete
AFTER DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_tour_reviews_count();

-- Update existing reviews_count for all tours
UPDATE tours t
SET reviews_count = (SELECT COUNT(*) FROM reviews r WHERE r.tour_id = t.id);